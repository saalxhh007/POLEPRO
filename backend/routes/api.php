<?php

use App\Http\Controllers\auth\AdminController;
use App\Http\Controllers\auth\StudentController;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Startup Api's
Route::prefix("startup")->group(function () {
    require base_path("routes/api/startup-api.php");
});

// Mentor Api's
Route::prefix("mentor")->group(function () {
    require base_path("routes/api/mentor-api.php");
});

// Event Api's
Route::prefix("event")->group(function () {
    require base_path("routes/api/event-api.php");
});
 
Route::prefix("team")->group(function () {
    require base_path("routes/api/team-api.php");
});

// Form Submission Api's
Route::post("/approval/submit-form", [StudentController::class, "submitForm"]);
Route::post("/approval/review-student/{id}", [AdminController::class, "reviewStudent"]);
Route::get("/approval/all-pending", [AdminController::class, "getAllPendingReq"]);
Route::get("/approval/all-approved", [AdminController::class, "getAllApprovedReq"]);
Route::post("/approval/delete/{id}", [AdminController::class, "deleteStudentRequest"]);

// User Api's
// Sign Api's
Route::post("/student/register/{id}", [StudentController::class, "register"]);
Route::post("/student/login", [StudentController::class, "login"]);
Route::post("/admin/login", [AdminController::class, "login"]);
Route::post('student/refresh-token', [StudentController::class, 'refreshToken']);

// Stats Api's
Route::get('/stats', [Controller::class, 'index']); // Get all stats