<?php

use App\Http\Controllers\Meeting\MeetingController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Startup\StartupController;


// only student
Route::middleware('role:student')->group(function () {
    Route::get('/{id}', [StartupController::class, 'myMeeting']); // get my startup based on my id
});
// only admin
Route::middleware('role:admin')->group(function () {
    Route::get('/{id}', [MeetingController::class, 'myMeeting']);
    Route::post('/', [MeetingController::class, 'store']); // Create a new meeting
    Route::put('/{id}', [MeetingController::class, 'update']); // Update a specific meeting
    Route::delete('/{id}', [MeetingController::class, 'destroy']); // Delete a specific meeting
    Route::post('/meeting/schedule', [StartupController::class, 'stotr']); // Schedule a new meeting
    Route::put('/meeting/complete/{id}', [StartupController::class, 'completed']); // Mark meeting as completed
    Route::delete('/meeting/delete/{id}', [StartupController::class, 'destroyMeet']);
    Route::get('/mentor_startup/{startupId}', [StartupController::class, 'MentorFromStartup']);
    Route::get('/startup_mentor/{mentorId}', [StartupController::class, 'StartupsFromMentor']);
    Route::get('/team/{id}/founders', [StartupController::class, 'getFounders']);
});
