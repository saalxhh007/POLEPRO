<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use App\Mail\StudentApprovalMail;
use App\Mail\StudentRejectionMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
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
                    $studentData = [
                        "id" => $student["id"],
                        "matricule" => $student['matricule'],
                        'email' => $student['email'],
                        'first_name_ar' => $student['last_name_ar'],
                        'last_name_ar' => $student['last_name_ar'],
                        'idea' => $student['idea'],
                        "name" => $student["name"],
                        "number_of_members" => $student["number_of_members"]
                    ];

                    if (empty($studentData["email"])) {
                        return response()->json([
                            'message' => 'Email address is required.',
                            'success' => false
                        ], 400);
                    }

                    if ($req->decision === "approve") {
                        $encryptedData = Crypt::encrypt($studentData);
                        $encryptedData = urlencode($encryptedData);

                        $approvedStudents[] = $student;
                        Storage::put($this->approved_file, json_encode($approvedStudents, JSON_PRETTY_PRINT));

                        $frontendUrl = config('app.frontend_url');
                        $registrationLink = "{$frontendUrl}/signup?token={$encryptedData}";
                        Mail::to($studentData["email"])->send(new StudentApprovalMail($studentData['last_name_ar'], $registrationLink));

                        unset($students[$index]);
                        Storage::put($this->pending_file, json_encode(array_values($students), JSON_PRETTY_PRINT));

                        return response()->json([
                            "success" => true,
                            "message" => "Accepted."
                        ]);
                    } elseif ($req->decision === "reject") {
                        Mail::to($studentData["email"])->send(new StudentRejectionMail($student['last_name_ar']));

                        unset($students[$index]);
                        Storage::put($this->pending_file, json_encode(array_values($students), JSON_PRETTY_PRINT));

                        return response()->json([
                            "success" => true,
                            "message" => "Rejected."
                        ]);
                    }
                }
            }

            return response()->json(['message' => 'Student not found.'], 404);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'An error occurred while processing your request.',
                'error' => $e->getMessage(),
                'success' => false
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

    public function deleteAll()
    {
        $pendingstudents = $this->getAllPendingReq();
        $approvedstudents = $this->getAllApprovedReq();

        $pendingstudents = [];
        Storage::put($this->pending_file, json_encode($pendingstudents, JSON_PRETTY_PRINT));

        $approvedstudents = [];
        Storage::put($this->approved_file, json_encode($approvedstudents, JSON_PRETTY_PRINT));

        return response()->json(['message' => 'All deleted'], 200);
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
