<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Startup\StartupController;


// API Routes for managing the startup database (everyone has access)
Route::get('/', [StartupController::class, 'index']); // Get all startups
Route::get('/{id}', [StartupController::class, 'show']); // Get a specific startup
Route::get('all/recent', [StartupController::class, 'recent']); // get all recent startups
Route::get('/all/industries', [StartupController::class, 'industries']);

Route::get('/get/summary', [StartupController::class, 'getStartupSummary']);
// only student
Route::middleware('role:student')->group(function () {
    Route::get('get/my-startup', [StartupController::class, 'myStartup']);
});
// only admin
Route::middleware('role:admin')->group(function () {
    Route::post('/', [StartupController::class, 'store']); // Create a new startup
    Route::put('/{id}', [StartupController::class, 'update']); // Update a specific startup
    Route::delete('/{id}', [StartupController::class, 'destroy']); // Delete a specific startup
    Route::post('/meeting/schedule', [StartupController::class, 'meetingSchedule']); // Schedule a new meeting
    Route::put('/meeting/complete/{id}', [StartupController::class, 'completed']); // Mark meeting as completed
    Route::delete('/meeting/delete/{id}', [StartupController::class, 'destroyMeet']);
    Route::get('/mentor_startup/{startupId}', [StartupController::class, 'MentorFromStartup']);
    Route::get('/startup_mentor/{mentorId}', [StartupController::class, 'StartupsFromMentor']);
    Route::get('/team/{id}/founders', [StartupController::class, 'getFounders']);
    Route::post('/assign/{studentId}', [StartupController::class, 'assignStartup']);
});
