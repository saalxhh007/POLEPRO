<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Startup\StartupController;

// API Routes for managing the startup database
Route::prefix('')->group(function () {
    Route::get('/', [StartupController::class, 'index']); // Get all startups
    Route::get('/recent', [StartupController::class, 'recent']); // get all recent startups
    Route::post('/', [StartupController::class, 'store']); // Create a new startup
    Route::get('/{id}', [StartupController::class, 'show']); // Get a specific startup
    Route::put('/{id}', [StartupController::class, 'update']); // Update a specific startup
    Route::delete('/{id}', [StartupController::class, 'destroy']); // Delete a specific startup
});
