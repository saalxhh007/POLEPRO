<?php

use App\Http\Controllers\auth\AdminController;
use App\Http\Controllers\auth\StudentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Form Submission Api's
Route::post("/approval/submit-form", [StudentController::class, "submitForm"]);
Route::post("/approval/review-student/{id}", [AdminController::class, "reviewStudent"]);
Route::get("/approval/all-pending", [AdminController::class, "getAllPendingReq"]);
Route::get("/approval/all-approved", [AdminController::class, "getAllApprovedReq"]);
Route::post("/approval/delete/{id}", [AdminController::class, "deleteStudentRequest"]);

// Sign Api's
Route::post("/student/register/{id}", [StudentController::class, "register"]);
Route::post("/student/login", [StudentController::class, "login"]);
Route::post("/admin/login", [AdminController::class, "login"]);
Route::post('student/refresh-token', [StudentController::class, 'refreshToken']);

// Logout Api's
