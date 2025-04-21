<?php

namespace App\Http\Controllers\Startup;

use App\Http\Controllers\Controller;
use App\Models\Startup;
use App\Models\Stats;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class StartupController extends Controller
{
    // Get All Startups
    function index()
    {
        $startups = Startup::all();

        if ($startups->isEmpty()) {
            return response()->json([
                "status" => false,
                "message" => "No Startups Found",
            ]);
        }
        return response()->json([
            "status" => true,
            "data" => $startups,
        ], Response::HTTP_OK);
    }
    function recent()
    {
        try {
            $startups = Startup::orderBy('join_date', 'desc')->take(5)->get();
            return $startups;
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    // Create A Startup
    function store()
    {
        try {
            $data = request()->validate([
                'name' => 'required|string',
                'industry' => 'nullable|string',
                'stage' => 'nullable|string',
                'founders' => 'nullable|string',
                'join_date' => 'nullable|date',
                'status' => 'required|in:active,warning,inactive',
                'progress' => 'nullable|integer',
                'team_id' => 'required|integer',
                'idea_stage' => 'required|string',
                'idea' => 'required|string',
                'description' => 'required|string',
                'innovation' => 'required|string',
                'target_customers' => 'required|string',
                'originality' => 'required|string',
                'sector' => 'required|string',
                'other_details' => 'required|string',
                'business_model' => 'required|string',
                'supervisor_name' => 'required|string',
                'submission_date' => 'required|date',
                'modified_date' => 'required|date',
                'is_final' => 'required|boolean',
                'in_pole' => 'required|boolean',
                'approved_by_dean' => 'required|boolean',
                'faculty_code' => 'required|string',
                'advisor_id' => 'required|integer',
                'advisor_grade' => 'required|string',
                'advisor_specialization' => 'required|string',
                'advisor_faculty' => 'required|string',
                'advisor_department' => 'required|string',
                'idea_origin' => 'required|string',
            ]);

            $startup = Startup::create($data);

            $counter = Stats::firstOrCreate(
                ['counted_obj' => 'startups'],
                ['counter' => 0]
            );
            $counter->increment('counter');

            return response()->json([
                'status' => true,
                'message' => 'Startup Created Successfully',
                'data' => $startup,
            ], Response::HTTP_CREATED);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error Creating Startup',
                'error' => $th->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    // Get A Startup Data's
    function show($project_id)
    {
        $startup = Startup::find($project_id);

        if (!$startup) {
            return response()->json(['message' => 'Startup not found'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($startup, Response::HTTP_OK);
    }
    // Update A Startup Data's
    function update($project_id)
    {

        try {
            $startup = Startup::find($project_id);

            if (!$startup) {
                return response()->json(['message' => 'Startup not found'], Response::HTTP_NOT_FOUND);
            }
            $data = request()->validate([
                'name' => 'sometimes|required|string',
                'industry' => 'sometimes|nullable|string',
                'stage' => 'sometimes|nullable|string',
                'founders' => 'sometimes|nullable|string',
                'join_date' => 'sometimes|nullable|date',
                'status' => 'sometimes|required|in:active,warning,inactive',
                'progress' => 'sometimes|nullable|integer',
                'team_id' => 'sometimes|required|integer',
                'idea_stage' => 'sometimes|required|string',
                'idea' => 'sometimes|required|string',
                'description' => 'sometimes|required|string',
                'innovation' => 'sometimes|required|string',
                'target_customers' => 'sometimes|required|string',
                'originality' => 'sometimes|required|string',
                'sector' => 'sometimes|required|string',
                'other_details' => 'sometimes|required|string',
                'business_model' => 'sometimes|required|string',
                'supervisor_name' => 'sometimes|required|string',
                'submission_date' => 'sometimes|required|date',
                'modified_date' => 'sometimes|required|date',
                'is_final' => 'sometimes|required|boolean',
                'in_pole' => 'sometimes|required|boolean',
                'approved_by_dean' => 'sometimes|required|boolean',
                'faculty_code' => 'sometimes|required|string',
                'advisor_id' => 'sometimes|required|integer',
                'advisor_grade' => 'sometimes|required|string',
                'advisor_specialization' => 'sometimes|required|string',
                'advisor_faculty' => 'sometimes|required|string',
                'advisor_department' => 'sometimes|required|string',
                'idea_origin' => 'sometimes|required|string',
            ]);


            $startup->update($data);

            return response()->json([
                'status' => true,
                'message' => 'Startup Updated Successfully',
                'data' => $startup
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error Updating Startup',
                'error' => $th->getMessage()
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    // Drop A Startup
    function destroy($project_id)
    {
        $startup = Startup::find($project_id);
        if (!$startup) {
            return response()->json(['message' => 'Startup not found'], Response::HTTP_NOT_FOUND);
        }
        $startup->delete();
        $maxId = Startup::max('project_id');
        $nextId = $maxId ? $maxId + 1 : 1;
        DB::statement("ALTER TABLE startups AUTO_INCREMENT = $nextId");

        $stats = Stats::where('counted_obj', 'startups')->first();
        if ($stats) {
            $stats->counter = max(0, $stats->counter - 1);
            $stats->save();
        }
        return response()->json([
            "success" => true,
            'message' => 'Startup deleted successfully'
        ], Response::HTTP_OK);
    }
}
