<?php

namespace App\Http\Controllers\Startup;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use App\Models\Mentor;
use App\Models\Startup;
use App\Models\Stats;
use App\Models\Team;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class StartupController extends Controller
{
    // Get All Startups
    function index()
    {
        $startups = Startup::all();
        foreach ($startups as $startup) {
            if ($startup->founders) {
                $startup->founders = json_decode($startup->founders, true);
            }
        }
        if ($startups->isEmpty()) {
            return response()->json([
                "success" => false,
                "message" => "No Startups Found",
            ]);
        }
        return response()->json([
            "success" => true,
            "data" => $startups,
        ], Response::HTTP_OK);
    }
    // 5 Recent Startups
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
                'join_date' => 'nullable|date',
                'status' => 'required|in:active,warning,inactive',
                'progress' => 'nullable|integer',
                'team_id' => 'required|integer',
                'idea_stage' => 'nullable|string',
                'idea' => 'nullable|string',
                'description' => 'nullable|string',
                'innovation' => 'nullable|string',
                'target_customers' => 'nullable|string',
                'originality' => 'nullable|string',
                'sector' => 'nullable|string',
                'other_details' => 'nullable|string',
                'business_model' => 'nullable|string',
                'supervisor_name' => 'nullable|string',
                'submission_date' => 'nullable|date',
                'modified_date' => 'nullable|date',
                'is_final' => 'required|boolean',
                'in_pole' => 'required|boolean',
                'approved_by_dean' => 'required|boolean',
                'faculty_id' => 'required|integer',
                'advisor_id' => 'nullable|integer',
                'idea_origin' => 'nullable|string',
            ]);
            if (!empty($data['join_date'])) {
                $data['join_date'] = date('Y-m-d', strtotime($data['join_date']));
            }
            if (!empty($data['submission_date'])) {
                $data['submission_date'] = date('Y-m-d H:i:s', strtotime($data['submission_date']));
            }
            if (!empty($data['modified_date'])) {
                $data['modified_date'] = date('Y-m-d H:i:s', strtotime($data['modified_date']));
            }

            $startup = Startup::create($data);

            $counter = Stats::firstOrCreate(
                ['counted_obj' => 'startups'],
                ['counter' => 0]
            );
            $counter->increment('counter');

            DB::table('teams')
                ->where('id', $data['team_id'])
                ->update(['startup_id' => $startup->id]);
            return response()->json([
                'success' => true,
                'message' => 'Startup Created Successfully',
                'data' => $startup,
            ], Response::HTTP_CREATED);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
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
            return response()->json([
                "success" => false,
                'message' => 'Startup not found'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            "success" => true,
            "data" => $startup,
        ], Response::HTTP_OK);
    }
    // Update A Startup Data's
    function update($id)
    {
        try {
            $startup = Startup::find($id);

            if (!$startup) {
                return response()->json([
                    "success" => false,
                    'message' => 'Startup not found'
                ], Response::HTTP_NOT_FOUND);
            }
            $data = request()->validate([
                'name' => 'required|string',
                'industry' => 'nullable|string',
                'stage' => 'nullable|string',
                'founders' => 'nullable|array',
                'join_date' => 'nullable|date',
                'status' => 'required|in:active,warning,inactive',
                'progress' => 'nullable|integer',
                'team_id' => 'required|integer',
                'idea_stage' => 'nullable|string',
                'idea' => 'nullable|string',
                'description' => 'nullable|string',
                'innovation' => 'nullable|string',
                'target_customers' => 'nullable|string',
                'sector' => 'nullable|string',
                'originality' => 'nullable|string',
                'other_details' => 'nullable|string',
                'business_model' => 'nullable|string',
                'supervisor_name' => 'nullable|string',
                'submission_date' => 'nullable|date',
                'modified_date' => 'nullable|date',
                'is_final' => 'nullable|boolean',
                'in_pole' => 'nullable|boolean',
                'approved_by_dean' => 'nullable|boolean',
                'faculty_code' => 'nullable|string',
                'advisor_id' => 'nullable|integer',
                'idea_origin' => 'nullable|string',
            ]);

            $startup->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Startup Updated Successfully',
                'data' => $startup
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error Updating Startup',
                'error' => $th->getMessage()
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    // Drop A Startup
    function destroy($id)
    {
        try {
            $startup = Startup::find($id);
            if (!$startup) {
                return response()->json([
                    "success" => false,
                    'message' => 'Startup not found'
                ], Response::HTTP_NOT_FOUND);
            }

            $relation = DB::table('mentor_startup')->where('startup_id', $id)->first();
            if ($relation) {
                $mentor = Mentor::find($relation->mentor_id);
                if ($mentor) {
                    $mentor->availability = 'available';
                    $mentor->startups = max(0, $mentor->startups - 1);
                    $mentor->save();
                    DB::table('mentor_startup')
                        ->where('startup_id', $id)
                        ->where('mentor_id', $relation->mentor_id)
                        ->delete();
                }
            }

            $startup->delete();
            $maxId = Startup::max('id');
            $nextId = $maxId ? $maxId + 1 : 1;
            DB::statement("ALTER TABLE startup AUTO_INCREMENT = $nextId");

            $stats = Stats::where('counted_obj', 'startups')->first();
            if ($stats) {
                $stats->counter = max(0, $stats->counter - 1);
                $stats->save();
            }
            return response()->json([
                "success" => true,
                'message' => 'Startup deleted successfully'
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                'message' => $th->getMessage()
            ], Response::HTTP_OK);
        }
    }

    function meetingSchedule(Request $req)
    {
        try {
            $data = $req->validate([
                'mentor_id' => 'required|exists:mentors,id',
                'team_id' => 'required|exists:teams,id',
                "title" => "nullable|string",
                "description" => "nullable|string",
                "duration" => "nullable|string",
                "type" => "required|string",
                'date' => 'required|date|after:now',
                'time' => 'required|string',
            ]);

            $data['date'] = Carbon::parse($data['date'])->toDateString();

            $meeting = Meeting::create($data);
            return response()->json([
                'success' => true,
                'message' => 'Meeting scheduled',
                'meeting' => $meeting
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'error' => $th->getMessage()
            ]);
        }
    }

    private function destroyMeet()
    {
        Meeting::where('status', 'completed')
            ->where('date', '<', now()->subDays(1))
            ->delete();
    }
    public function completed($id)
    {
        try {
            Meeting::where('id', $id)->update(['status' => 'completed']);
            return response()->json([
                'success' => true,
                'message' => "status updated successfuly"
            ]);
            $this->destroyMeet();
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'error' => $th->getMessage()
            ]);
        }
    }

    public function MentorFromStartup($startupId)
    {
        try {
            $mentors = DB::table('mentor_startup')
                ->where('startup_id', $startupId)
                ->join('mentors', 'mentor_startup.mentor_id', '=', 'mentors.id')
                ->select('mentors.id', 'mentors.name', 'mentors.expertise', 'mentors.company', 'mentors.availability', 'mentors.image', 'mentors.email')
                ->get();

            if ($mentors->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No mentors found for this startup',
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'data' => $mentors,
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'error' => $th->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    public function StartupsFromMentor($mentorId)
    {
        try {
            $startups = DB::table('mentor_startup')
                ->where('mentor_startup.mentor_id', $mentorId)
                ->join('startup', 'mentor_startup.startup_id', '=', 'startup.id')
                ->join('mentors', 'mentor_startup.mentor_id', '=', 'mentors.id')
                ->select(
                    'startup.id',
                    'startup.name',
                    'startup.industry',
                    'startup.team_id',
                    'startup.status',
                    'startup.faculty_id',
                    'startup.advisor_id'
                )
                ->get();

            if ($startups->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No startups found for this mentor',
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'data' => $startups,
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'error' => $th->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getFounders($id)
    {
        try {
            $team = Team::with('members.student')->find($id);

            if (!$team) {
                return response()->json([
                    "success" => false,
                    'message' => 'Team not found'
                ], 404);
            }

            $founders = $team->members->map(function ($member) {
                return $member->student->first_name_ar . ' ' . $member->student->last_name_ar;
            });

            return response()->json([
                "success" => true,
                'founders' => $founders
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                'message' => $th->getMessage()
            ]);
        }
    }
}
