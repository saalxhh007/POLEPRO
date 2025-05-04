<?php

use App\Http\Controllers\auth\AdminController;
use App\Http\Controllers\auth\StudentController;
use App\Http\Controllers\auth\UserController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\ParticipantsController;
use App\Http\Controllers\Startup\StartupController;
use Illuminate\Support\Facades\Route;

Route::middleware("role:admin")->group(function () {
    Route::prefix("mentor")->group(function () {
        require base_path("routes/api/mentor-api.php"); // Mentor Api's
    });
    Route::prefix("intervenant")->group(function () {
        require base_path("routes/api/intervenant-api.php"); // Intervenant Api's
    });
    Route::post("/user/register", [UserController::class, "register"]); // review a syudent request (accept / reject)
    Route::post("/approval/review-student/{id}", [AdminController::class, "reviewStudent"]); // get all the pending
    Route::get("/approval/all-pending", [AdminController::class, "getAllPendingReq"]); // get all the pending
    Route::get("/approval/all-approved", [AdminController::class, "getAllApprovedReq"]); // get all the approved
    Route::delete("/approval/delete/{id}", [AdminController::class, "deleteStudentRequest"]); // delete a req 
    Route::delete("/approval/delete", [AdminController::class, "deleteAll"]); // delete all req's 
    Route::get('/stats', [Controller::class, 'index']); // Get all stats
    Route::get("/advisors", [Controller::class, "index_adv"]); // Get All Advisors
    // Put Them In The Event Api's Group Later
    Route::get('/participent/all', [ParticipantsController::class, 'showParticipants']);
    Route::post('/participent/admin/approve/{id}', [ParticipantsController::class, 'approve']);
    Route::post('/participent/admin/delete-form/', [ParticipantsController::class, 'deleteAll']);
    Route::post('/participent/add', [ParticipantsController::class, 'add']);
    Route::get('/participants/export', [ParticipantsController::class, 'exportParticipantsCSV']);
    Route::post('/participants/send-reminders', [ParticipantsController::class, 'sendReminders']);
});
// Startup Api's
Route::prefix("team")->group(function () {
    require base_path("routes/api/team-api.php"); // Team Api's
});
Route::get('/team/{id}/founders', [StartupController::class, 'getFounders']);
// Startup api
Route::prefix("startup")->group(function () {
    require base_path("routes/api/startup-api.php");
});
// Event Api's
Route::prefix("event")->group(function () {
    require base_path("routes/api/event-api.php");
});
// Form Submission Api's
Route::post("/approval/submit-form", [StudentController::class, "submitForm"]);
Route::post("/student/register/{id}", [StudentController::class, "register"]);

// User Api's
// Sign Api's
Route::post("/user/login", [UserController::class, "login"]);
Route::post("/user/refresh-token", [UserController::class, "refreshToken"]);
Route::post('/decrypt-token', [StudentController::class, 'decryptStudentToken']);

// More Api's
Route::post('/participent/submit-form', [ParticipantsController::class, 'submit']);
