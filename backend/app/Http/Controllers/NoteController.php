<?php

namespace App\Http\Controllers;

use App\Models\Notes;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index($startupId)
    {
        try {
            $notes = Notes::where('startup_id', $startupId)->get();
            return response()->json([
                'success' => true,
                'message' => 'Notes retrieved successfully.',
                'data' => $notes
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch notes.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $note = Notes::findOrFail($id);
            return response()->json([
                'success' => true,
                'message' => 'Note retrieved successfully.',
                'data' => $note
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Note not found.'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch note.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'startup_id' => 'required|integer|exists:startup,id',
                'content' => 'required|string',
                'created_by' => 'nullable|string|max:255',
            ]);

            $note = Notes::create($validated);
            return response()->json([
                'success' => true,
                'message' => 'Note created successfully.',
                'data' => $note
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create note.',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $note = Notes::findOrFail($id);

            $validated = $request->validate([
                'content' => 'sometimes|required|string',
                'created_by' => 'nullable|string|max:255',
            ]);

            $note->update($validated);
            return response()->json([
                'success' => true,
                'message' => 'Note updated successfully.',
                'data' => $note
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Note not found.'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update note.',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function destroy($id)
    {
        try {
            $note = Notes::findOrFail($id);
            $note->delete();

            return response()->json([
                'success' => true,
                'message' => 'Note deleted successfully.'
            ], 204);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Note not found.'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete note.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
