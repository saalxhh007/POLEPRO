<?php

namespace App\Http\Controllers\Event;

use App\Http\Controllers\Controller;
use App\Models\Comments;
use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Intervenant;
use Carbon\Carbon;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    // Get All Events
    function index()
    {
        $events = Event::all();

        if ($events->isEmpty()) {
            return response()->json([
                "success" => false,
                "message" => "No Events Found",
            ]);
        }

        $formattedEvents = $events->map(function ($event) {
            return [
                'id' => $event->id,
                'title' => $event->title,
                'type' => $event->type,
                'description' => $event->description,
                'date' => Carbon::parse($event->date)->format('d-m-Y'),
                'time' => $event->time,
                'location' => $event->location,
                'capacity' => $event->capacity,
                'tags' => $event->tags,
                'fiche' => $event->fiche,
                'fiche_title' => $event->fiche_title,
                'fiche_alternatif' => $event->fiche_alternatif,
                'supp' => $event->supp,
            ];
        });

        return response()->json([
            "success" => true,
            "data" => $formattedEvents
        ], Response::HTTP_OK);
    }
    // Create A Event
    function store(Request $request)
    {
        try {
            $data = $request->validate([
                'title' => 'required|string',
                'type' => 'required|string',
                'description' => 'nullable|string',
                'date' => 'required|date',
                'time' => 'required|string',
                'location' => 'required|string',
                'capacity' => 'required|integer|min:1',
                'tags' => 'nullable|string',
                'fiche_title' => 'nullable|string',
                'fiche_alternatif' => 'nullable|string',
                'fiche' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
                'supp.*' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
                'intervenants' => 'nullable|string',
            ]);

            if ($request->hasFile('fiche')) {
                $data['fiche'] = $request->file('fiche')->store('fiches');
            }
            $suppPaths = [];
            if ($request->hasFile('supp')) {
                foreach ($request->file('supp') as $file) {
                    $suppPaths[] = $file->store('event_supps');
                }
            }

            $data['date'] = Carbon::parse($data['date'])->toDateString();

            $event = Event::create($data);

            if (!empty($data['intervenants'])) {
                $intervenantIds = json_decode($data['intervenants'], true);
                Intervenant::whereIn('id', $intervenantIds)->update(['event_id' => $event->id]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Event Created Successfully',
                'data' => $event
            ], Response::HTTP_CREATED);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error Creating Event',
                'error' => $th->getMessage()
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function show($id)
    {
        try {
            $event = Event::findOrFail($id);

            $data = [
                'id' => $event->id,
                'title' => $event->title,
                'type' => $event->type,
                'description' => $event->description,
                'date' => Carbon::parse($event->date)->format('d-m-Y'),
                'time' => $event->time,
                'location' => $event->location,
                'capacity' => $event->capacity,
                'tags' => $event->tags,
                'fiche' => $event->fiche,
                'fiche_title' => $event->fiche_title,
                'fiche_alternatif' => $event->fiche_alternatif,
                'supp' => $event->supp
            ];

            return response()->json([
                'success' => true,
                'data' => $data
            ], Response::HTTP_OK);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Event not found'
            ], Response::HTTP_NOT_FOUND);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong',
                'error' => $th->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    function update(Request $req, $id)
    {
        try {
            $event = Event::find($id);
            if (!$event) {
                return response()->json([
                    "success" => false,
                    'message' => 'Event not found'
                ], Response::HTTP_NOT_FOUND);
            }

            $data = $req->validate([
                'title' => 'sometimes|required|string',
                'type' => 'sometimes|required|string',
                'description' => 'sometimes|nullable|string',
                'date' => 'sometimes|required|date',
                'time' => 'sometimes|required|string',
                'location' => 'sometimes|required|string',
                'capacity' => 'sometimes|nullable|integer',
                'tags' => 'sometimes|nullable|string',
                'fiche' => 'sometimes|nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
                'fiche_title' => 'sometimes|nullable|string',
                'fiche_alternatif' => 'sometimes|nullable|string',
                'supp.*' => 'sometimes|nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:10240',
            ]);

            if ($req->hasFile('fiche')) {
                $data['fiche'] = $req->file('fiche')->store('fiches');
            }

            if ($req->hasFile('supp')) {
                $supp = [];
                foreach ($req->file('supp') as $document) {
                    $supp[] = $document->store('supp');
                }
                $data['supp'] = json_encode($supp);
            }

            $event->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Event Updated Successfully',
                'data' => $event
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error Updating Event',
                'error' => $th->getMessage()
            ]);
        }
    }

    function destroy($id)
    {
        $mantor = Event::find($id);

        if (!$mantor) {
            return response()->json(['message' => 'Event not found'], Response::HTTP_NOT_FOUND);
        }

        $mantor->delete();

        return response()->json(['message' => 'Event deleted successfully'], Response::HTTP_OK);
    }

    // Get All The upcoming
    function upcoming()
    {
        $today = Carbon::today();
        $events = Event::where('date', '>=', $today)->orderBy('date', 'asc')->get();

        if ($events->isEmpty()) {
            return response()->json([
                "success" => false,
                "message" => "No Events Found",
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Upcoming Events Retrieved Successfully',
            'data' => $events,
        ]);
    }

    public function eventPoster($eventId)
    {
        try {
            $event = Event::find($eventId);

            if (!$event || !$event->fiche) {
                return response()->json([
                    "success" => false,
                    'message' => 'Poster not found'
                ], 404);
            }

            // Clean the path
            $path = $event->fiche;

            if (!Storage::exists($path)) {
                return response()->json([
                    "success" => false,
                    'message' => 'Poster file missing'
                ], 404);
            }

            return Storage::download($path);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                'message' => $th->getMessage()
            ], 404);
        }
    }
    public function comment(Request $req)
    {
        try {
            $validated = $req->validate([
                'event_id' => 'required|exists:events,id',
                "comment" => "required|string"
            ]);

            $comment = Comments::create([
                'event_id' => $validated['event_id'],
                'comment' => $validated['comment']
            ]);

            return response()->json([
                'success' => true,
                "message" => "Comment Created Successfully",
                'data' => $comment
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                "message" => $th->getMessage(),
            ]);
        }
    }

    public function allComments($eventId)
    {
        try {
            $comments = Comments::where('event_id', $eventId)->get();

            if ($comments->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No comments found for this event',
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'data' => $comments
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving comments',
                'error' => $th->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Share Event
    // function shareEvent(Request $req)
    // {
    //     $validated = $req->validate([
    //         'article.title' => 'required|string|max:255',
    //         'article.link' => 'required|url',
    //         'platforms' => 'required|array|min:1',
    //         'platforms.*' => 'string|in:facebook,instagram,linkedin,twitter',
    //     ]);

    //     $article = $validated['article'];
    //     $platforms = $validated['platforms'];

    //     $responses = [];

    //     foreach ($platforms as $platform) {
    //         switch ($platform) {
    //             case 'facebook':
    //                 $responses['facebook'] = $this->shareToFacebook($article);
    //                 break;
    //             case 'instagram':
    //                 $responses['instagram'] = $this->shareToInstagram($article);
    //                 break;
    //             case 'linkedin':
    //                 $responses['linkedin'] = $this->shareToLinkedIn($article);
    //                 break;
    //             default:
    //                 $responses[$platform] = 'Unsupported Platform';
    //         }
    //     }

    //     return response()->json([
    //         'success' => true,
    //         $responses,
    //     ], Response::HTTP_OK);
    // }

    // Share Event To Facebook
    // function shareToFacebook(Request $req)
    // {
    //     try {
    //         $validated = $req->validate([
    //             'article.title' => 'required|string|max:255',
    //             'article.link' => 'required|url',
    //             'platforms' => 'required|array|min:1',
    //             'platforms.*' => 'string|in:facebook,instagram,linkedin,twitter',
    //         ]);

    //         $article = $validated['article'];

    //         $pageAccessToken = env('FACEBOOK_PAGE_ACCESS_TOKEN');
    //         $pageId = env('FACEBOOK_PAGE_ID');

    //         $response = Http::timeout(5)->post("https://graph.facebook.com/{$pageId}/feed", [
    //             'message' => "{$article['title']}\n{$article['link']}",
    //             'access_token' => $pageAccessToken,
    //         ]);

    //         return response()->json([
    //             'success' => true,
    //             'response' => $response->json()
    //         ], Response::HTTP_OK);
    //     } catch (\Throwable $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Error sharing to fb',
    //             'error' => $e->getMessage()
    //         ], Response::HTTP_INTERNAL_SERVER_ERROR);
    //     }
    // }

    // private function shareToInstagram($article)
    // {
    //     try {
    //         //code...
    //     } catch (\Throwable $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Error sharing to ig',
    //             'error' => $e->getMessage()
    //         ], Response::HTTP_INTERNAL_SERVER_ERROR);
    //     }
    // }
    // private function shareToLinkedIn($article)
    // {
    //     try {

    //         $pageAccessToken = env('LINKEDIN_PAGE_ACCESS_TOKEN');
    //         $authorId = env('LINKEDIN_PAGE_ID');

    //         $response = Http::withToken($pageAccessToken)
    //             ->timeout(5)
    //             ->post("https://api.linkedin.com/v2/ugcPosts", [
    //                 'author' => $authorId,
    //                 'lifecycleState' => 'PUBLISHED',
    //                 'specificContent' => [
    //                     'com.linkedin.ugc.ShareContent' => [
    //                         'shareCommentary' => ['text' => "{$article['title']}\n{$article['link']}"],
    //                         'shareMediaCategory' => 'NONE',
    //                     ],
    //                 ],
    //                 'visibility' => [
    //                     'com.linkedin.ugc.MemberNetworkVisibility' => 'PUBLIC',
    //                 ],
    //             ]);

    //         return response()->json([
    //             'success' => true,
    //             'response' => $response->json()
    //         ], Response::HTTP_OK);
    //     } catch (\Throwable $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Error sharing to linkendin',
    //             'error' => $e->getMessage()
    //         ], Response::HTTP_INTERNAL_SERVER_ERROR);
    //     }
    // }
}
