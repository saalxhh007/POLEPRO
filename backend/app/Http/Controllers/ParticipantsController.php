<?php

namespace App\Http\Controllers;

use App\Mail\AcceptanceNotification;
use App\Mail\RejectionNotification;
use App\Mail\ReminderMail;
use App\Models\Participants;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ParticipantsController extends Controller
{
    public function submit(Request $req)
    {
        try {
            $req->validate([
                'name' => 'required',
                "role" => "required",
                'email' => 'required|email',
                'phone' => "string",
                'organization' => "string",
                'expectations' => "string",
                'event_id' => 'required',
            ]);
            $pending = Storage::exists('pending_requests.json')
                ? json_decode(Storage::get('pending_requests.json'), true)
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
            Storage::put('pending_requests.json', json_encode($pending, JSON_PRETTY_PRINT));

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
            $pending = json_decode(Storage::get('pending_requests.json'), true);
            $index = collect($pending)->search(fn($u) => $u['id'] === $id);

            if ($index !== false) {
                $user = $pending[$index];

                if ($status === 'confirmed') {
                    Participants::create([
                        'name' => $user["name"],
                        'role' => $user["role"],
                        'email' => $user["email"],
                        'phone' => $user["phone"],
                        'organization' => $user["organization"],
                        'expectations' => $user["expectations"],
                        'event_id' => $user["event_id"],
                    ]);

                    Mail::to($user['email'])->send(new AcceptanceNotification($user['name']));
                } elseif ($status === 'declined') {
                    Mail::to($user['email'])->send(new RejectionNotification($user['name']));
                }

                $pending[$index]['status'] = $status;
                Storage::put('pending_requests.json', json_encode($pending, JSON_PRETTY_PRINT));

                return response()->json([
                    "success" => true,
                    "message" => "User has been $status and notified."
                ]);
            }

            return response()->json(["success" => false, "message" => "User not found."]);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "data" => $th->getMessage()
            ]);
        }
    }

    public function showParticipants()
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
                    "event_id" => $participant->event_id,
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
                    'event_id' => $p['event_id'],
                ];
            })->toArray();

            $allParticipants = array_merge($confirmed, $pendingFormatted);

            return response()->json([
                'success' => true,
                'participants' => $allParticipants
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage()
            ]);
        }
    }

    public function deleteAll()
    {
        try {
            // Check if the pending requests file exists
            if (!Storage::exists('pending_requests.json')) {
                return response()->json([
                    'success' => false,
                    'message' => 'No pending requests found.'
                ]);
            }

            // Delete the file to remove all pending requests
            Storage::delete('pending_requests.json');

            return response()->json([
                'success' => true,
                'message' => 'All pending requests deleted successfully.'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage()
            ]);
        }
    }

    public function add(Request $req)
    {
        try {
            $validated = $req->validate([
                'name' => 'required',
                "role" => "required",
                'email' => 'required|email',
                'phone' => "string|nullable",
                'organization' => "string|nullable",
                'expectations' => "string|nullable",
                'event_id' => 'required',
            ]);

            Participants::create($validated);

            Mail::to($validated['email'])->send(new AcceptanceNotification($validated['name']));

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
