<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
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
                "email" => "required|email",
                "idea" => "required|string",
            ]);

            $formData = [
                "id" => Str::uuid(),
                "matricule" => $req->matricule,
                "first_name_ar" => $req->first_name_ar,
                "last_name_ar" => $req->last_name_ar,
                "email" => $req->email,
                "idea" => $req->idea,
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
                        "matricule" => "string|min:8|max:8",
                        "email" => "email|unique:student,email",
                        "phone_number" => "required|string|unique:student,phone_number",
                        "birth_date" => "required|date|date_format:Y-m-d",
                        "gender" => "required|in:m,f",
                        "last_name_ar" => "string|regex:/^[\p{Arabic} ]+$/u|max:50",
                        "first_name_ar" => "regex:/^[\p{Arabic} ]+$/u|max:50",
                        "Domain_ar" => "required|regex:/^[\p{Arabic} ]+$/u|max:50",
                        "option_ar" => "required|regex:/^[\p{Arabic} ]+$/u|max:50",
                        "diploma_ar" => "required|regex:/^[\p{Arabic} ]+$/u|max:50",
                        "faculty_code" => "required|string",
                        "department_code" => "required|string",
                        "password" => "required|string|min:8|regex:/[A-Z]/|regex:/[0-9]/|regex:/[@$!%*?&]/",
                    ]);
                }

                $hashedPassword = Hash::make($req->password);

                $student = Student::create([
                    "matricule" => $approvedStudent["matricule"],
                    "email" => $approvedStudent["email"],
                    "phone_number" => $req->phone_number,
                    "birth_date" => $req->birth_date,
                    "gender" => $req->gender,
                    "last_name_ar" => $approvedStudent["last_name_ar"],
                    "first_name_ar" => $approvedStudent["first_name_ar"],
                    "Domain_ar" => $req->Domain_ar,
                    "option_ar" => $req->option_ar,
                    "diploma_ar" => $req->diploma_ar,
                    "faculty_code" => $req->faculty_code,
                    "department_code"  => $req->department_code,
                    "password" => $hashedPassword,
                ]);

                unset($approvedStudents[$index]);
                Storage::put(
                    'approved_students.json',
                    json_encode(array_values($approvedStudents), JSON_PRETTY_PRINT)
                );

                return response()->json([
                    'message' => 'Account Created Successfully',
                    "success" => true,
                    'student' => $student,
                ]);
            }
        } catch (\Throwable $e) {

            return response()->json([
                'message' => 'An error occurred while processing your request.',
                'error' => $e->getMessage(),
                "success" => false
            ], 500);
        }
    }

    // Log A New User
    public function login(Request $req)
    {
        try {

            $req->validate([
                "email" => "required|email",
                "password" => "required|string|min:8|regex:/[A-Z]/|regex:/[0-9]/|regex:/[@$!%*?&]/",
            ]);

            $student = Student::where("email", $req->email)->first();

            if (!$student || !Hash::check($req->password, $student->password)) {
                return response()->json([
                    "message" => "Student Account Doesn't Exist Or Approved Yet",
                    "success" => true,
                    403
                ]);
            }

            $accessToken = Str::random(60);
            $refreshToken = Str::random(60);

            $student->update(['refresh_token' => $refreshToken]);

            return response()->json([
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken,
                $student
            ]);
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

    public function refreshToken(Request $req)
    {
        $req->validate(['refresh_token' => 'required']);

        $student = Student::where('refresh_token', $req->refresh_token)->first();

        if (!$student) {
            return response()->json(['message' => 'Invalid refresh token'], 401);
        }

        $newAccessToken = Str::random(60);

        return response()->json(['access_token' => $newAccessToken]);
    }
}
