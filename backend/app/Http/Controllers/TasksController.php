<?php

namespace App\Http\Controllers;

use App\Models\Tasks;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class TasksController extends Controller
{
    public function getTasksByStartup($startupId)
    {
        try {
            $tasks = Tasks::where('startup_id', $startupId)->with('assignedUser')->get();
            return response()->json([
                'success' => true,
                'message' => 'Tasks retrieved successfully.',
                'data' => $tasks
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch tasks for startup.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getTasksByStudent($student_id)
    {
        try {
            $tasks = Tasks::where('assigned_to', $student_id)->with('startup')->get();
            return response()->json([
                'success' => true,
                'message' => 'Tasks retrieved successfully.',
                'data' => $tasks
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch tasks for user.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'startup_id' => 'required|exists:startup,id',
                'assigned_to' => 'required|exists:student,id',
                'status' => 'required|in:Planifié,En cours,Terminé',
                "date_limite" => "required"
            ]);

            $task = Tasks::create($validated);
            return response()->json([
                'success' => true,
                'message' => 'Task created successfully.',
                'data' => $task
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create task.',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $task = Tasks::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'assigned_to' => 'sometimes|nullable|exists:users,id',
                'status' => 'sometimes|in:Planifié,En cours,Terminé',
            ]);

            $task->update($validated);
            return response()->json([
                'success' => true,
                'message' => 'Task updated successfully.',
                'data' => $task
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found.'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update task.',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function destroy($id)
    {
        try {
            $task = Tasks::findOrFail($id);
            $task->delete();

            return response()->json([
                'success' => true,
                'message' => 'Task deleted successfully.'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found.'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete task.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
