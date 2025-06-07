<?php

namespace App\Http\Controllers;

use App\Mail\AcceptanceNotification;
use App\Mail\RejectionNotification;
use App\Mail\ReminderMail;
use App\Models\Event;
use App\Models\Participants;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel as QrCodeErrorCorrectionLevel;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Str;

class ParticipantsController extends Controller
{
    private $pending_event_request = 'private/pending_event_request.json';

    public function submit(Request $req)
    {
        try {
            $req->validate([
                'name' => 'required',
                "role" => "required",
                'email' => 'required|email',
                'phone' => "required|string",
                'organization' => "string|nullable",
                'expectations' => "string|nullable",
                'event_id' => 'required',
            ]);
            $pending = Storage::exists($this->pending_event_request)
                ? json_decode(Storage::get($this->pending_event_request), true)
                : [];

            $pending[] = [
                'id' => uniqid(),
                'name' => $req->name,
                'role' => $req->role,
                'email' => $req->email,
                'phone' => $req->phone,
                'organization' => $req->organization,
                'expectations' => $req->expectations,
                'event_id' => $req->event_id,
                "status" => "pending"
            ];
            Storage::put($this->pending_event_request, json_encode($pending, JSON_PRETTY_PRINT));

            return response()->json([
                'success' => true,
                'message' => 'Request submitted!'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "data" => $th->getMessage()
            ]);
        }
    }

    public function approve(Request $request, $id)
    {
        try {
            $status = $request->input('status');

            $pending = json_decode(Storage::get($this->pending_event_request), true);
            $index = collect($pending)->search(fn($u) => $u['id'] === $id);

            if ($index === false) {
                return response()->json(["success" => false, "message" => "User not found."]);
            }


            $user = $pending[$index];
            $event = Event::findOrFail($user["event_id"]);
            $currentCount = Participants::where('event_id', $user["event_id"])->count();

            if ($currentCount >= $event->capacity) {
                return response()->json([
                    "success" => false,
                    "message" => "Event has reached maximum capacity."
                ], 400);
            }
            $this->deleteOne($user["event_id"], $user["id"]);
            if ($status === 'confirmed') {
                $token = Str::uuid();
                $checkinUrl = url("api/participant/check-in/{$token}");

                $participant = Participants::create([
                    'name' => $user["name"],
                    'role' => $user["role"],
                    'email' => $user["email"],
                    'phone' => $user["phone"],
                    'organization' => $user["organization"],
                    'expectations' => $user["expectations"],
                    'event_id' => $user["event_id"],
                    'checkin_token' => $token,
                ]);

                if (strtolower($user["role"]) === 'intervenant') {
                    DB::table('event_intervenants')->insert([
                        'event_id' => $user["event_id"],
                        'intervenant_id' => $participant->id,
                    ]);
                }
                $qrResult = (new Builder(
                    writer: new PngWriter(),
                    data: $checkinUrl,
                    encoding: new Encoding('UTF-8'),
                    errorCorrectionLevel: QrCodeErrorCorrectionLevel::High,
                    size: 300,
                    margin: 10,
                    roundBlockSizeMode: RoundBlockSizeMode::Margin
                ))->build();
                $userId = $user['id'];
                $qrFileName = "qr_codes/checkin_{$userId}.png";
                storage_path("app/public/{$qrFileName}");

                Storage::disk('public')->put($qrFileName, $qrResult->getString());

                Mail::to($user['email'])->send(new AcceptanceNotification(
                    $user['name'],
                    $checkinUrl,
                    storage_path("app/public/" . $qrFileName),
                    $event->title
                ));
                return response()->json(["success" => true, "message" => "User approved successfully."]);
            } elseif ($status === 'declined') {
                Mail::to($user['email'])->send(new RejectionNotification($user['name']));
                return response()->json(["success" => true, "message" => "User declined."]);
            }

            return response()->json(["success" => false, "message" => "User not found."]);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "data" => $th->getMessage()
            ]);
        }
    }

    public function showEventParticipants($eventId)
    {
        try {
            $participants = Participants::where('event_id', $eventId)->get();

            $pending_participants = [];

            if (Storage::exists($this->pending_event_request)) {
                $all_pending = json_decode(Storage::get($this->pending_event_request), true);

                $pending_participants = array_filter($all_pending, function ($participant) use ($eventId) {
                    return isset($participant['event_id']) && $participant['event_id'] == $eventId;
                });

                $pending_participants = array_values($pending_participants);
            }
            $participants = $participants->map(function ($participant) {
                return [
                    ...$participant->toArray(),
                    'status' => 'approved'
                ];
            });
            $pending_participants = array_map(function ($pending_participants) {
                return [
                    ...$pending_participants,
                    'status' => 'pending'
                ];
            }, $pending_participants);
            return response()->json([
                'success' => true,
                'participants' => $participants,
                "pending_participants" => $pending_participants
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage()
            ]);
        }
    }

    public function showEventIntervenants($eventId)
    {
        try {
            $participants = Participants::where('event_id', $eventId)->get();
            $intervenants = $participants->filter(function ($participant) {
                return $participant->role === "intervenant";
            });
            return response()->json([
                'success' => true,
                'intervenants' => $intervenants
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage()
            ]);
        }
    }

    public function deleteOne($eventId, $participantId)
    {
        try {
            $pending = json_decode(Storage::get($this->pending_event_request), true);

            $index = collect($pending)->search(function ($item) use ($eventId, $participantId) {
                return $item['event_id'] == $eventId && $item['id'] == $participantId;
            });

            if ($index === false) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pending request not found.'
                ], 404);
            }

            unset($pending[$index]);

            $pending = array_values($pending);
            Storage::put($this->pending_event_request, json_encode($pending, JSON_PRETTY_PRINT));

            return response()->json([
                'success' => true,
                'message' => 'Pending request deleted successfully.'
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'An error occurred while processing your request.',
                'error' => $e->getMessage(),
                "success" => false
            ], 500);
        }
    }

    public function delete($eventId, $participantId)
    {
        try {
            $participant = Participants::findOrFail($participantId);

            $isIntervenant = DB::table('event_intervenants')
                ->where('event_id', $eventId)
                ->where('intervenant_id', $participantId)
                ->exists();

            if ($isIntervenant) {
                DB::table('event_intervenants')
                    ->where('event_id', $eventId)
                    ->where('intervenant_id', $participantId)
                    ->delete();
            }

            $participant->delete();
            return response()->json([
                "success" => true,
                "message" => "Participant has been successfully deleted."
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => $th->getMessage()
            ]);
        }
    }

    public function add(Request $req, $eventId)
    {
        try {
            $validated = $req->validate([
                'name' => 'required',
                "role" => "required",
                'email' => 'required|email',
                'phone' => "string|nullable",
                'organization' => "string|nullable",
                'expectations' => "string|nullable",
                'bio' => "string|nullable",
                'expertise' => "string|nullable",
            ]);
            $event = Event::findOrFail($eventId);
            $currentCount = Participants::where('event_id', $eventId)->count();
            if ($currentCount >= $event->capacity) {
                return response()->json([
                    "success" => false,
                    "message" => "Event has reached maximum capacity."
                ], 400);
            }

            $token = Str::uuid();
            $checkinUrl = url("/api/participant/check-in/{$token}");
            $validated['event_id'] = $eventId;
            $validated['checkin_token'] = $token;
            $participant = Participants::create($validated);

            if ($validated["role"] === "intervenant") {
                DB::table('event_intervenants')->insert([
                    'event_id' => $eventId,
                    'intervenant_id' => $participant->id,
                ]);
            }
            $eventName = $event->title;

            $qrResult = (new Builder(
                writer: new PngWriter(),
                data: $checkinUrl,
                encoding: new Encoding('UTF-8'),
                errorCorrectionLevel: QrCodeErrorCorrectionLevel::High,
                size: 300,
                margin: 10,
                roundBlockSizeMode: RoundBlockSizeMode::Margin
            ))->build();

            $qrFileName = "qr_codes/checkin_{$participant->id}.png";
            Storage::disk('public')->put($qrFileName, $qrResult->getString());

            Mail::to($validated["email"])->send(new AcceptanceNotification(
                $validated["name"],
                $checkinUrl,
                storage_path("app/public/" . $qrFileName),
                $eventName
            ));

            return response()->json([
                "success" => true,
                "message" => "User has been added and notified."
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "data" => $th->getMessage()
            ]);
        }
    }

    public function check_in($token)
    {
        $participant = Participants::where('checkin_token', $token)->first();
        $event = Event::findOrFail($participant->event_id);
        if (!$participant) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired check-in link.'
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Check-in successful. Welcome, ' . $participant->name . '!',
            'data' => [
                'name' => $participant->name,
                "role" => $participant->role,
                "event" => $event
            ]
        ]);
    }

    public function exportParticipantsCSV()
    {
        try {
            $pending = Storage::exists('pending_requests.json')
                ? json_decode(Storage::get('pending_requests.json'), true)
                : [];

            $confirmed = Participants::all()->map(function ($participant) {
                return [
                    'id' => $participant->id,
                    'name' => $participant->name,
                    'email' => $participant->email,
                    'phone' => $participant->phone,
                    'organization' => $participant->organization,
                    'role' => $participant->role,
                    'status' => 'confirmed',
                    'expectations' => $participant->expectations,
                ];
            })->toArray();

            $pendingFormatted = collect($pending)->map(function ($p) {
                return [
                    'id' => $p['id'],
                    'name' => $p['name'],
                    'email' => $p['email'],
                    'phone' => $p['phone'],
                    'organization' => $p['organization'],
                    'role' => $p['role'],
                    'status' => $p['status'],
                    'expectations' => $p['expectations'],
                ];
            })->toArray();

            $allParticipants = array_merge($confirmed, $pendingFormatted);

            $response = new StreamedResponse(function () use ($allParticipants) {
                $handle = fopen('php://output', 'w');

                fputcsv($handle, ['ID', 'Name', 'Email', 'Phone', 'Organization', 'Role', 'Status', 'Expectations']);

                foreach ($allParticipants as $participant) {
                    fputcsv($handle, [
                        $participant['id'],
                        $participant['name'],
                        $participant['email'],
                        $participant['phone'],
                        $participant['organization'],
                        $participant['role'],
                        $participant['status'],
                        $participant['expectations'],
                    ]);
                }

                fclose($handle);
            });

            $response->headers->set('Content-Type', 'text/csv');
            $response->headers->set('Content-Disposition', 'attachment; filename="participants.csv"');

            return $response;
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage()
            ]);
        }
    }

    public function sendReminders(Request $req)
    {
        $validated = $req->validate([
            'participantIds' => 'required|array',
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);

        $participants = Participants::whereIn('id', $validated['participantIds'])->get();

        foreach ($participants as $participant) {
            Mail::to($participant->email)->send(new ReminderMail($validated['subject'], $validated['message']));
        }

        return response()->json(['success' => true]);
    }
}
