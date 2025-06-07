<?php

namespace App\Http\Controllers\Startup;

use App\Http\Controllers\Controller;
use App\Mail\AcceptedToStartup;
use App\Models\Startup;
use App\Models\Stats;
use App\Models\Student;
use App\Models\Team;
use App\Models\TeamMember;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

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
            $team = Team::find($data["team_id"]);
            if (!$team) {
                return response()->json(['success' => false, 'message' => 'Team not found.'], 404);
            }
            $founder = DB::table('team_members')
                ->where('team_id', $data['team_id'])
                ->where('role', 'founder')
                ->first();

            if (!$founder) {
                return response()->json([
                    'success' => false,
                    'message' => 'Founder not found in the team.',
                ], 404);
            }
            $student = Student::find($founder->student_id);
            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student not found.',
                ], 404);
            }
            $startup = Startup::create($data);
            $student->startup_id = $startup->id;
            $student->save();

            $counter = Stats::firstOrCreate(
                ['counted_obj' => 'startups'],
                ['counter' => 0]
            );
            $counter->increment('counter');

            DB::table('teams')
                ->where('id', $data['team_id'])
                ->update(['startup_id' => $startup->id]);

            $studentIds = DB::table('team_members')
                ->where('team_id', $data['team_id'])
                ->pluck('student_id');

            DB::table('student')
                ->whereIn('id', $studentIds)
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

            DB::table('student')
                ->where('startup_id', $id)
                ->update(['startup_id' => null]);


            DB::table('mentors')
                ->where('startup_id', $id)
                ->update([
                    'availability' => 'available',
                    'startup_id' => null,
                    'startups' => DB::raw('GREATEST(startups - 1, 0)')
                ]);

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
    // Get The Completed Meetings
    // public function completed($id)
    // {
    //     try {
    //         Meeting::where('id', $id)->update(['status' => 'completed']);
    //         return response()->json([
    //             'success' => true,
    //             'message' => "status updated successfuly"
    //         ]);
    //         $this->destroyMeet();
    //     } catch (\Throwable $th) {
    //         return response()->json([
    //             'success' => false,
    //             'error' => $th->getMessage()
    //         ]);
    //     }
    // }

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
    public function myStartup(Request $request)
    {
        $authHeader = $request->header('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'message' => 'Authorization token missing or invalid.'
            ], 401);
        }

        $token = str_replace('Bearer ', '', $authHeader);

        try {
            $key = env('JWT_SECRET');
            $decoded = JWT::decode($token, new Key($key, 'HS256'));

            $student = Student::where('matricule', $decoded->matricule)->first();

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student not found.'
                ], 404);
            }

            if (!$student->startup_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'No startup associated with this student.'
                ], 404);
            }

            $startup = Startup::find($student->startup_id);

            if (!$startup) {
                return response()->json([
                    'success' => false,
                    'message' => 'Startup not found.'
                ], 404);
            }

            $teamId = $startup->team_id;

            $founders = DB::table('team_members')
                ->join('student', 'team_members.student_id', '=', 'student.id')
                ->where('team_members.team_id', $teamId)
                ->where('team_members.role', 'founder')
                ->select('student.id', 'student.first_name_ar', 'student.email', 'team_members.role')
                ->get();

            $teamMembers = DB::table('team_members')
                ->join('student', 'team_members.student_id', '=', 'student.id')
                ->where('team_members.team_id', $teamId)
                ->select('student.id', 'student.first_name_ar', 'student.email', 'team_members.role')
                ->get();

            $startup->founders = $founders;
            $startup->team_members = $teamMembers;

            return response()->json([
                'success' => true,
                'startup' => $startup
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid token.',
                'error' => $e->getMessage()
            ], 401);
        }
    }

    private function getIndustryColor($industryName)
    {
        $colors = [
            "Technology" => "#0ea5e9",
            "Healthcare" => "#10b981",
            "Finance" => "#f59e0b",
            "Education" => "#8b5cf6",
            "Retail" => "#ec4899",
            "Manufacturing" => "#f43f5e",
            "Other" => "#6b7280",
        ];

        return $colors[$industryName] ?? "#6b7280";
    }
    public function industries()
    {
        try {
            $startups = Startup::all();
            $industryCounts = [
                "Technology" => 0,
                "Healthcare" => 0,
                "Finance" => 0,
                "Education" => 0,
                "Retail" => 0,
                "Manufacturing" => 0,
                "Other" => 0,
            ];

            foreach ($startups as  $startup) {
                if (array_key_exists($startup->industry, $industryCounts)) {
                    $industryCounts[$startup->industry]++;
                } else {
                    $industryCounts["Other"]++;
                }
            }

            $totalStartups = count($startups);
            $industries = [];

            foreach ($industryCounts as $name => $count) {
                $percentage = $totalStartups > 0 ? ($count / $totalStartups) * 100 : 0;

                $industries[] = [
                    'name' => $name,
                    'percentage' => round($percentage, 2),
                    'color' => $this->getIndustryColor($name),
                ];
            }

            return $industries;
        } catch (\Throwable $th) {
            return response()->json([
                'error' => 'Unable to fetch industries.',
                "message" => $th
            ], 500);
        }
    }

    public function getStartupSummary()
    {
        try {
            $startups = DB::table('startup')
                ->join('teams', 'startup.team_id', '=', 'teams.id')
                ->join('team_members', 'teams.id', '=', 'team_members.team_id')
                ->join('student', 'team_members.student_id', '=', 'student.id')
                ->select(
                    'startup.id',
                    'startup.name',
                    'startup.progress',
                    'startup.status',
                    'startup.join_date as startDate',
                    'startup.modified_date as endDate',
                    DB::raw('GROUP_CONCAT(CONCAT(student.first_name_ar, " ", student.last_name_ar) ORDER BY student.id SEPARATOR ", ") as teamMembers')
                )
                ->groupBy('startup.id', 'startup.name', 'startup.progress', 'startup.status', 'startup.join_date', 'startup.modified_date')
                ->get();

            if ($startups->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No startups found',
                ], Response::HTTP_NOT_FOUND);
            }

            return response()->json([
                'success' => true,
                'data' => $startups,
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching startup summary',
                'error' => $th->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function assignStartup($studentId)
    {
        $data = request()->validate([
            'project_id' => 'required',
            "role" => "required"
        ]);

        try {
            $startup = Startup::findOrFail($data['project_id']);
            if (!$startup->team_id) {
                return response()->json(['error' => 'Startup does not have an associated team.'], 400);
            }

            $student = Student::findOrFail($studentId);
            $student->startup_id = $data['project_id'];
            $student->save();

            $existing = TeamMember::where('student_id', $studentId)
                ->where('team_id', $startup->team_id)
                ->first();

            if ($existing) {
                return response()->json(['message' => 'Student is already a member of the startup team.'], 200);
            }

            TeamMember::create([
                'student_id' => $studentId,
                'team_id' => $startup->team_id,
                'role' => $data["role"],
            ]);

            Mail::to($student->email)->send(new AcceptedToStartup($student->last_name_ar));

            return response()->json([
                "success" => true,
                'message' => 'Student successfully assigned to the startup team.'
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                'message' => $th->getMessage()
            ], 200);
        }
    }
}
