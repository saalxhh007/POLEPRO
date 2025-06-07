<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Mentor\MentorController;

Route::get('/startups/{id}', [MentorController::class, 'startupFromMentor']); // get all startups For A Mentor //
Route::get('/sessions/{id}', [MentorController::class, 'sessionsFromMentor']); // get all sessions For A Mentor //
Route::get('/{id}', [MentorController::class, 'show']); // Get a specific mentor //
Route::get('/', [MentorController::class, 'index']); // Get all mentors
// API Routes for managing the mantor database
Route::middleware('role:admin')->group(function () {
    Route::get('/check/available', [MentorController::class, 'available']); // Get all available mentors
    Route::post('/', [MentorController::class, 'store']); // Create a new mentor
    Route::put('/{id}', [MentorController::class, 'update']); // Update a specific mentor
    Route::delete('/{id}', [MentorController::class, 'destroy']); // Delete a specific mentor
    Route::post('/startup/assign', [MentorController::class, 'assignMentor']); // Assign a mentor to a startup
});
