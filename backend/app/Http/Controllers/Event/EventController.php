<?php

namespace App\Http\Controllers\Event;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;

class EventController extends Controller
{
    // Get All Events
    function index()
    {
        $events = Event::all();
        if ($events->isEmpty()) {
            return response()->json([
                "status" => false,
                "message" => "No Events Found",
            ]);
        }
        return response()->json([
            "status" => true,
            "data" => $events
        ], Response::HTTP_OK);
    }
    // Create A Event
    function store(Request $request)
    {
        try {
            $data = $request->validate([
                "title" => "required|string",
                "type" => "required|string",
                "description" => "nullable|string",
                "date" => "required|date",
                "time" => "required|string",
                "location" => "required|string",
                "capacity" => "nullable|integer",
                "tags" => "nullable|string",
                "fiche" => "nullable|file|mimes:jpg,jpeg,png,pdf|max:5120",
                "fiche_title" => "nullable|string",
                "fiche_alternatif" => "nullable|string",
                "supp.*" => "nullable|file|mimes:pdf,doc,docx,ppt,pptx|max:10240",
            ]);

            if ($request->hasFile('fiche')) {
                $data['fiche'] = $request->file('fiche')->store('fiches');
            }

            if ($request->hasFile('supp')) {
                $supp = [];
                foreach ($request->file('supp') as $document) {
                    $supp[] = $document->store('supp');
                }
                $data['supp'] = json_encode($supp);
            }

            $data['date'] = Carbon::parse($data['date'])->toDateString();

            $event = Event::create($data);
            return response()->json([
                'status' => true,
                'message' => 'Event Created Successfully',
                'data' => $event
            ], Response::HTTP_CREATED);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error Creating Event',
                'error' => $th->getMessage()
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    function show($id)
    {
        try {

            $event = Event::find($id);

            if (!$event) {
                return response()->json([
                    "success" => false,
                    'message' => 'Event not found'
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                "success" => true,
                "data" => $event
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "data" => $th->getMessage()
            ], Response::HTTP_OK);
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

            $data = $$req->validate([
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
                'status' => true,
                'message' => 'Event Updated Successfully',
                'data' => $event
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
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
                "status" => false,
                "message" => "No Events Found",
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Upcoming Events Retrieved Successfully',
            'data' => $events,
        ]);
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
    //         'status' => true,
    //         $responses,
    //     ], Response::HTTP_OK);
    // }

    // Share Event To Facebook
    function shareToFacebook(Request $req)
    {
        try {
            $validated = $req->validate([
                'article.title' => 'required|string|max:255',
                'article.link' => 'required|url',
                'platforms' => 'required|array|min:1',
                'platforms.*' => 'string|in:facebook,instagram,linkedin,twitter',
            ]);
    
            $article = $validated['article'];
    
            $pageAccessToken = env('FACEBOOK_PAGE_ACCESS_TOKEN');
            $pageId = env('FACEBOOK_PAGE_ID');

            $response = Http::timeout(5)->post("https://graph.facebook.com/{$pageId}/feed", [
                'message' => "{$article['title']}\n{$article['link']}",
                'access_token' => $pageAccessToken,
            ]);

            return response()->json([
                'success' => true,
                'response' => $response->json()
            ], Response::HTTP_OK);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error sharing to fb',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    private function shareToInstagram($article)
    {
        try {
            //code...
        } catch (\Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error sharing to ig',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    private function shareToLinkedIn($article)
    {
        try {

            $pageAccessToken = env('LINKEDIN_PAGE_ACCESS_TOKEN');
            $authorId = env('LINKEDIN_PAGE_ID');

            $response = Http::withToken($pageAccessToken)
                ->timeout(5)
                ->post("https://api.linkedin.com/v2/ugcPosts", [
                    'author' => $authorId,
                    'lifecycleState' => 'PUBLISHED',
                    'specificContent' => [
                        'com.linkedin.ugc.ShareContent' => [
                            'shareCommentary' => ['text' => "{$article['title']}\n{$article['link']}"],
                            'shareMediaCategory' => 'NONE',
                        ],
                    ],
                    'visibility' => [
                        'com.linkedin.ugc.MemberNetworkVisibility' => 'PUBLIC',
                    ],
                ]);

            return response()->json([
                'success' => true,
                'response' => $response->json()
            ], Response::HTTP_OK);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error sharing to linkendin',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
