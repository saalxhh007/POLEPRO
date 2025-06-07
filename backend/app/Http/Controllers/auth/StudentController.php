<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use App\Models\Startup;
use App\Models\Stats;
use App\Models\Student;
use App\Models\Team;
use App\Models\TeamMember;
use Carbon\Carbon;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StudentController extends Controller
{
    private $pending_file = "private/pending_student.json";
    private $approved_file = "private/approved_student.json";

    // Submit A Forum For A Project
    public function submitForm(Request $req)
    {
        try {
            $req->validate([
                "matricule" => "required|string|min:12|max:12|unique:student,matricule",
                "first_name_ar" => "required|string",
                "last_name_ar" => "required|string",
                "email" => "required|email|unique:student,email",
                "idea" => "required|string",
                // team
                "name" => "required|string",
                "number_of_members" => "required"
            ]);

            $formData = [
                "id" => Str::uuid(),
                "matricule" => $req->matricule,
                "first_name_ar" => $req->first_name_ar,
                "last_name_ar" => $req->last_name_ar,
                "email" => $req->email,
                "idea" => $req->idea,
                "name" => $req->name,
                "number_of_members" => $req->number_of_members
            ];


            $students = $this->getAllPendingReq();
            $students[] = $formData;

            Storage::put($this->pending_file, json_encode($students, JSON_PRETTY_PRINT));

            return response()->json([
                'message' => 'Your Request Has Been Submitted For Approval.',
                "success" => true
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'An error occurred while processing your request.',
                'error' => $e->getMessage(),
                "success" => false
            ], 500);
        }
    }

    // Register A New User
    public function register(Request $req, $id)
    {
        try {
            $approvedStudents = $this->getAllApprovedReq();

            foreach ($approvedStudents as $index => $approvedStudent) {
                if ($approvedStudent["id"] === $id) {
                    $req->validate([
                        "matricule" => "string",
                        "email" => "email|unique:student,email",
                        "phone_number" => "required|string|unique:student,phone_number",
                        "birth_date" => "required|string",
                        "gender" => "required|in:m,f",
                        "last_name_ar" => "string|required|max:50",
                        "first_name_ar" => "required|string|max:50",
                        "Domain_ar" => "required|string|max:50",
                        "option_ar" => "required|string|max:50",
                        "diploma_ar" => "required|string|max:50",
                        "faculty_code" => "required|string",
                        "department_code" => "required|string",
                        "password" => "required|string|min:8|regex:/[A-Z]/|regex:/[0-9]/|regex:/[@$!%*?&]/",
                        // team
                        "team_name" => "required|string",
                        "number_of_members" => "required"
                    ]);

                    $birthDate = Carbon::parse($req->birth_date);

                    if (!$birthDate) {
                        return response()->json([
                            'message' => 'Invalid birth date format.',
                            'success' => false
                        ], 422); // Unprocessable Entity
                    }

                    $hashedPassword = Hash::make($req->password);
                    $counter = Stats::firstOrCreate(
                        ['counted_obj' => 'students'],
                        ['counter' => 0]
                    );
                    $counter->increment('counter');

                    $student = Student::create([
                        "matricule" => $approvedStudent["matricule"],
                        "email" => $approvedStudent["email"],
                        "phone_number" => $req->phone_number,
                        "birth_date" => $birthDate->format('Y-m-d'),
                        "gender" => $req->gender,
                        "last_name_ar" => $approvedStudent["last_name_ar"],
                        "first_name_ar" => $approvedStudent["first_name_ar"],
                        "Domain_ar" => $req->Domain_ar,
                        "option_ar" => $req->option_ar,
                        "diploma_ar" => $req->diploma_ar,
                        "faculty_code" => $req->faculty_code,
                        "department_code" => $req->department_code,
                        "password" => $hashedPassword,
                    ]);

                    $team = Team::create([
                        "number_of_members" => $req->number_of_members,
                        "name" => $req->team_name,
                    ]);

                    TeamMember::create([
                        "team_id" => $team->id,
                        "student_id" => $student->id,
                        "role" => "founder",
                    ]);

                    $counter = Stats::firstOrCreate(
                        ['counted_obj' => 'teams'],
                        ['counter' => 0]
                    );
                    $counter->increment('counter');

                    unset($approvedStudents[$index]);
                    Storage::put(
                        'approved_students.json',
                        json_encode(array_values($approvedStudents), JSON_PRETTY_PRINT)
                    );

                    return response()->json([
                        'message' => 'Account Created Successfully',
                        "success" => true,
                    ]);
                }
            }
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'An error occurred while processing your request.',
                'error' => $e->getMessage(),
                "success" => false
            ], 500);
        }
    }

    function getAllPendingReq()
    {
        try {
            if (!Storage::exists($this->pending_file)) {
                return [];
            }

            return json_decode(Storage::get($this->pending_file), true) ?? [];
        } catch (\Throwable $e) {

            return response()->json([
                'message' => 'An error occurred while processing your request.',
                'error' => $e->getMessage(),
                "success" => false
            ], 500);
        }
    }

    function getAllApprovedReq()
    {
        try {
            if (!Storage::exists($this->approved_file)) {
                return [];
            }

            return json_decode(Storage::get($this->approved_file), true) ?? [];
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'An error occurred while processing your request.',
                'error' => $e->getMessage(),
                "success" => false
            ], 500);
        }
    }

    public function decryptStudentToken(Request $request)
    {
        $token = $request->input('token');

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Token is missing.'
            ], 422);
        }

        try {
            $key = env('JWT_SECRET');
            $decoded = JWT::decode($token, new Key($key, 'HS256'));

            return response()->json([
                'success' => true,
                'student' => $decoded,
            ]);
        } catch (\Throwable $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function getStudentByToken(Request $request)
    {
        $token = $request->header('token');

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Token is required.'
            ], 400);
        }

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

            return response()->json([
                'success' => true,
                'student' => $student
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid token.',
                'error' => $e->getMessage()
            ], 401);
        }
    }

    public function decryptStudentTokenForm(Request $request)
    {
        $token = $request->input('token');

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Token is missing.'
            ], 422);
        }

        try {
            $decrypted = Crypt::decrypt($token);

            return response()->json([
                'success' => true,
                'student' => $decrypted,
            ]);
        } catch (\Throwable $e) {

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function allStudents()
    {
        try {

            $students = Student::all();
            if ($students->isEmpty()) {
                return response()->json([
                    "success" => false,
                    "message" => "No Student Exists"
                ]);
            }

            $startupIds = $students->pluck('startup_id')->unique();
            $startups = Startup::whereIn('id', $startupIds)->get()->keyBy('id');
            foreach ($students as $student) {
                $student->startup_name = $startups->has($student->startup_id) ? $startups[$student->startup_id]->name : "No Startup";
            }

            return response()->json([
                "success" => true,
                "data" => $students
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => $th->getMessage()
            ]);
        }
    }

    public function removeStudent($id)
    {
        try {
            $student = Student::find($id);

            if (!$student) {
                return response()->json([
                    "success" => false,
                    "message" => "Student not found"
                ]);
            }

            $student->delete();

            return response()->json([
                "success" => true,
                "message" => "Student removed successfully"
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => $th->getMessage()
            ]);
        }
    }

    public function registerStudent(Request $req)
    {
        // Validate the incoming request data
        $data = $req->validate([
            "matricule" => "string",
            "email" => "email|unique:student,email",
            "phone_number" => "required|string|unique:student,phone_number",
            "birth_date" => "required|string",
            "gender" => "required|in:m,f",
            "last_name_ar" => "string|required|max:50",
            "first_name_ar" => "required|string|max:50",
            "Domain_ar" => "required|string|max:50",
            "option_ar" => "required|string|max:50",
            "diploma_ar" => "required|string|max:50",
            "faculty_code" => "required|string",
            "department_code" => "required|string",
            "password" => "required|string|min:8|regex:/[A-Z]/|regex:/[0-9]/|regex:/[@$!%*?&]/",
        ]);

        $data["password"] = Hash::make($req->password);
        try {
            // Create a new student record
            $student = Student::create($data);

            $counter = Stats::firstOrCreate(
                ['counted_obj' => 'students'],
                ['counter' => 0]
            );
            $counter->increment('counter');

            return response()->json([
                "success" => true,
                "message" => "Student registered successfully.",
                "data" => $student
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "message" => $th->getMessage()
            ]);
        }
    }
}
