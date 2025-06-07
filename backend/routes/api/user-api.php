<?php

use App\Http\Controllers\auth\AdminController;
use App\Http\Controllers\auth\StudentController;
use App\Http\Controllers\auth\UserController;
use Illuminate\Support\Facades\Route;

// API Routes for managing the startup database (everyone has access)
Route::post("/approval/submit-form", [StudentController::class, "submitForm"]); //
Route::post("/student/register/{id}", [StudentController::class, "register"]); //
Route::post("/refresh-token", [UserController::class, "refresh"]); //
Route::post("/login", [UserController::class, "login"]); //
Route::post("/logout", [UserController::class, "logout"]); //
Route::delete("/approval/delete", [AdminController::class, "deleteAll"]);
// only admin
Route::middleware('role:admin')->group(function () {
    Route::get("/approval/all-approved", [AdminController::class, "getAllApprovedReq"]); // get all the approved  //
    Route::get("/approval/all-pending", [AdminController::class, "getAllPendingReq"]); // get all the pending  //
    Route::post("/register", [UserController::class, "register"]); // Create A new Student || A new Mentor
    Route::post("/approval/review-student/{id}", [AdminController::class, "reviewStudent"]);  // review a student request (accept / reject)
    Route::get("/all-students", [StudentController::class, "allStudents"]);
    Route::delete("/remove/{id}", [StudentController::class, "removeStudent"]);
    Route::post("/registerStudent", [StudentController::class, "registerStudent"]);
});

// only student
Route::middleware('role:student')->group(function () {
    Route::post('/decrypt-token', [StudentController::class, 'decryptStudentToken']); //
    Route::post('/decrypt-token-form', [StudentController::class, 'decryptStudentTokenForm']); //
    Route::get('/get-student-profile', [StudentController::class, 'getStudentByToken']);
    Route::put('/password-update', [UserController::class, 'passwordUpdate']);
});
