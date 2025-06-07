<?php

namespace App\Http\Controllers\Team;

use App\Http\Controllers\Controller;
use App\Models\Stats;
use App\Models\Team;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class TeamController extends Controller
{
    // Get All Teams
    function index()
    {
        try {
            $teams = Team::all();

            if ($teams->isEmpty()) {
                return response()->json([
                    "status" => false,
                    "message" => "No Teams Found",
                ]);
            }
            return response()->json([
                "status" => true,
                "data" => $teams,
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            return response()->json([
                "status" => false,
                "error" => $th->getMessage(),
            ], Response::HTTP_OK);
        }
    }
    // Create A Team
    function store()
    {
        try {
            $data = request()->validate([
                "name" => "required",
                "number_of_members" => "required"
            ]);

            $team = Team::create($data);

            Stats::firstOrCreate(
                ['counted_obj' => 'teams'],
                ['counter' => 0]
            );

            $stats = Stats::where('counted_obj', 'teams')->first();
            if ($stats) {
                $stats->counter = max(0, $stats->counter + 1);
                $stats->save();
            }

            return response()->json([
                'status' => true,
                'message' => 'Team Created Successfully',
                'data' => $team,
            ], Response::HTTP_CREATED);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error Creating Team',
                'error' => $th->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    // Get A Team Data's
    function show($project_id)
    {
        $team = Team::find($project_id);

        if (!$team) {
            return response()->json(['message' => 'Team not found'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($team, Response::HTTP_OK);
    }
    // Update A Team Data's
    function update($id)
    {

        try {
            $team = Team::find($id);

            if (!$team) {
                return response()->json(['message' => 'Team not found'], Response::HTTP_NOT_FOUND);
            }
            $data = request()->validate([
                'name' => 'sometimes|required|string',
                "number_of_members" => "sometimes"
            ]);

            $team->update($data);

            return response()->json([
                'status' => true,
                'message' => 'Team Updated Successfully',
                'data' => $team
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error Updating Team',
                'error' => $th->getMessage()
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    // Drop A Team
    function destroy($id)
    {
        $team = Team::find($id);
        if (!$team) {
            return response()->json(['message' => 'Team not found'], Response::HTTP_NOT_FOUND);
        }
        $team->delete();
        $maxId = Team::max('id');
        $nextId = $maxId ? $maxId + 1 : 1;
        DB::statement("ALTER TABLE TEAMS AUTO_INCREMENT = $nextId");

        $stats = Stats::where('counted_obj', 'teams')->first();
        if ($stats) {
            $stats->counter = max(0, $stats->counter - 1);
            $stats->save();
        }
        return response()->json([
            "success" => true,
            'message' => 'Team deleted successfully'
        ], Response::HTTP_OK);
    }

    function StartupTeamMembers($startupId)
    {
        try {
            $members = DB::table('teams')
                ->join('team_members', 'teams.id', '=', 'team_members.team_id')
                ->join('student', 'team_members.student_id', '=', 'student.id')
                ->where('teams.startup_id', $startupId)
                ->select('student.first_name_ar', 'student.last_name_ar', 'team_members.role', "student.id")
                ->get();

            return response()->json([
                'success' => true,
                'members' => $members
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve team members',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
