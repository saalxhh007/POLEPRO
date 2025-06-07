<?php

use App\Http\Controllers\Team\TeamController;
use Illuminate\Support\Facades\Route;

Route::get('/startup/team-members/{startupId}', [TeamController::class, 'StartupTeamMembers']); // Get a specific team

// API Routes for managing the team database
Route::middleware("role:admin")->group(function () {
    Route::get('/', [TeamController::class, 'index']); // Get all teams
    Route::post('/', [TeamController::class, 'store']); // Create a new team
    Route::get('/{id}', [TeamController::class, 'show']); // Get a specific team
    Route::put('/{id}', [TeamController::class, 'update']); // Update a specific team
    Route::delete('/{id}', [TeamController::class, 'destroy']); // Delete a specific team
});
