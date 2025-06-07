<?php

namespace App\Http\Controllers\Intervenant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Intervenant;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class IntervenantController extends Controller
{
    // Get All Intervenant
    function index()
    {
        $intervenants = Intervenant::all();
        if ($intervenants->isEmpty()) {
            return response()->json([
                "success" => false,
                "message" => "No Intervenant Found",
            ]);
        }
        return response()->json([
            "success" => true,
            "data" => $intervenants
        ], Response::HTTP_OK);
    }
    // Create A Intervenant
    function store(Request $req)
    {
        try {
            $data = $req->validate([
                'nom' => 'required|string',
                'email' => 'required|email',
                'expertise' => 'required|string',
                'bio' => 'nullable|string',
                'photo' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
                'telephone' => 'nullable|string',
                'organisation' => 'nullable|string',
                'event_id' => 'nullable|integer|exists:events,id',
                'role' => 'nullable|string',
            ]);

            $intervenant = Intervenant::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Intervenant Created Successfully',
                'data' => $intervenant
            ], Response::HTTP_CREATED);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error Creating Intervenant',
                'error' => $th->getMessage()
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    function show($id)
    {
        $intervenant = Intervenant::find($id);

        if (!$intervenant) {
            return response()->json(['message' => 'Intervenant not found'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($intervenant, Response::HTTP_OK);
    }

    function update(Request $request, $id)
    {
        $intervenant = Intervenant::find($id);

        if (!$intervenant) {
            return response()->json([
                'success' => false,
                'message' => 'Intervenant not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $data = $request->validate([
            'nom' => 'sometimes|required|string',
            'email' => 'sometimes|required|email',
            'expertise' => 'sometimes|required|string',
            'bio' => 'nullable|string',
            'photo' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
            'telephone' => 'nullable|string',
            'organisation' => 'nullable|string',
            'event_id' => 'nullable|integer|exists:events,id',
            'role' => 'nullable|string',
        ]);

        if ($request->hasFile('photo')) {
            if ($intervenant->photo && Storage::exists($intervenant->photo)) {
                Storage::delete($intervenant->photo);
            }

            $data['photo'] = $request->file('photo')->store('intervenants');
        }

        $intervenant->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Intervenant updated successfully',
            'data' => $intervenant
        ]);
    }

    function destroy($id)
    {
        $intervenant = Intervenant::find($id);

        if (!$intervenant) {
            return response()->json([
                'success' => false,
                'message' => 'Intervenant not found'
            ], Response::HTTP_NOT_FOUND);
        }

        if ($intervenant->photo && Storage::exists($intervenant->photo)) {
            Storage::delete($intervenant->photo);
        }

        $intervenant->delete();

        return response()->json([
            'success' => true,
            'message' => 'Intervenant deleted successfully'
        ]);
    }

    function eventIntervenants($eventId)
    {
        try {
            $intervenants = Intervenant::where('event_id', $eventId)->get();

            if ($intervenants->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No intervenants found for this event.',
                    'data' => []
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'data' => $intervenants,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching intervenants.',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
