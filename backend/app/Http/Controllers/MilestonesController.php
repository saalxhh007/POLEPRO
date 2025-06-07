<?php

namespace App\Http\Controllers;

use App\Models\Milestones;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MilestonesController extends Controller
{

    public function index($startupId)
    {
        try {
            $milestones = Milestones::where('startup_id', $startupId)->get();

            return response()->json([
                'success' => true,
                'message' => 'Milestones retrieved successfully',
                'data' => $milestones,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving milestones: ' . $th->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show($id)
    {
        try {
            $milestone = Milestones::findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Milestone retrieved successfully',
                'data' => $milestone,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving milestone: ' . $th->getMessage(),
            ], Response::HTTP_NOT_FOUND);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $milestone = Milestones::findOrFail($id);

            $validated = $request->validate([
                'status' => 'required|in:Planifié,En cours,Terminé',
                'due_date' => 'required|date',
            ]);

            $milestone->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Milestone updated successfully',
                'data' => $milestone,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating milestone: ' . $th->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
