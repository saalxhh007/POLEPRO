<?php

namespace App\Http\Controllers\Event;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Intervenant;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    // Get All Intervenants
    function index()
    {
        $intervenant = Intervenant::all();

        if ($intervenant->isEmpty()) {
            return response()->json([
                "success" => false,
                "message" => "No Intervenant Found",
            ]);
        }

        return response()->json([
            "success" => true,
            "data" => $intervenant
        ], Response::HTTP_OK);
    }
    // Create An Intervenant
    function store(Request $request)
    {
        try {
            $data = $request->validate([
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

            if ($request->hasFile('photo')) {
                $data['photo'] = $request->file('photo')->store('intervenants');
            }

            $intervenant = Intervenant::create($data);
            return response()->json([
                'success' => true,
                'message' => 'Event Created Successfully',
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

    public function show($id)
    {
        $intervenant = Intervenant::find($id);

        if (!$intervenant) {
            return response()->json([
                'success' => false,
                'message' => 'Intervenant not found'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'data' => $intervenant
        ]);
    }

    public function update(Request $request, $id)
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
            // Delete old photo if exists
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


    public function destroy($id)
    {
        $intervenant = Intervenant::find($id);

        if (!$intervenant) {
            return response()->json([
                'success' => false,
                'message' => 'Intervenant not found'
            ], Response::HTTP_NOT_FOUND);
        }

        // Delete photo if exists
        if ($intervenant->photo && Storage::exists($intervenant->photo)) {
            Storage::delete($intervenant->photo);
        }

        $intervenant->delete();

        return response()->json([
            'success' => true,
            'message' => 'Intervenant deleted successfully'
        ]);
    }
}
