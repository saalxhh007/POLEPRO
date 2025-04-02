<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use App\Mail\StudentApprovalMail;
use App\Mail\StudentRejectionMail;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    private $pending_file = 'private/pending_student.json';
    private $approved_file = 'private/approved_student.json';

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

    public function getAllPendingReq()
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

    public function reviewStudent(Request $req, $id)
    {
        try {
            $req->validate(['decision' => 'required|in:approve,reject']);

            $students = $this->getAllPendingReq();
            $approvedStudents = $this->getAllApprovedReq();

            foreach ($students as $index => $student) {
                if ($student["id"] === $id) {
                    $email = $student["email"];

                    if (empty($email)) {
                        return response()->json([
                            'message' => 'Email address is required.',
                            'success' => $req
                        ], 400);
                    }

                    if ($req->decision === "approve") {
                        $approvedStudents[] = $student;
                        Storage::put($this->approved_file, json_encode($approvedStudents, JSON_PRETTY_PRINT));

                        $registrationLink = url("/student/register/{$id}");
                        Mail::to($email)->send(new StudentApprovalMail($student['last_name_ar'], $registrationLink));

                        unset($students[$index]);
                        Storage::put($this->pending_file, json_encode(array_values($students), JSON_PRETTY_PRINT));
                        return response()->json(["message" => "Accepted ."]);
                    }

                    Mail::to($email)->send(new StudentRejectionMail($student['last_name_ar']));
                    return response()->json(["message" => "Rejected ."]);
                }
            }
            return response()->json(['message' => 'Student not found'], 404);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'An error occurred while processing your request.',
                'error' => $e->getMessage(),
                "success" => false
            ], 500);
        }
    }

    public function deleteStudentRequest($id)
    {
        $students = $this->getAllPendingReq();

        foreach ($students as $index => $student) {
            if ($student['id'] === $id) {
                unset($students[$index]);
                Storage::put($this->pending_file, json_encode(array_values($students), JSON_PRETTY_PRINT));
                return response()->json(['message' => 'Request deleted successfully']);
            }
        }

        return response()->json(['message' => 'Request not found'], 404);
    }

    public function login(Request $req)
    {
        try {

            $req->validate([
                "email" => "required|email",
                "password" => "required|string|min:8|regex:/[A-Z]/|regex:/[0-9]/|regex:/[@$!%*?&]/",
            ]);

            $admin = Admin::where("email", $req->email)->first();

            if (!$admin || !Hash::check($req->password, $admin->password)) {
                return response()->json(["message" => "Admin Account Doesn't Exist"], 403);
            }

            $token = $admin->createToken("auth_token")->plainTextToken;

            return response()->json([
                "message" => "Login Successful",
                "success" => true,
                "token" => $token
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'An error occurred while processing your request.',
                'error' => $e->getMessage(),
                "success" => false
            ], 500);
        }
    }

    public function logout(Request $req)
    {
        try {

            $req->user()->tokens()->delete();
            return response()->json(["message" => "Logout Successful"]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'An error occurred while processing your request.',
                'error' => $e->getMessage(),
                "success" => false
            ], 500);
        }
    }
}
