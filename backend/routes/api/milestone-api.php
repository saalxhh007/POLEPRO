<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MilestonesController;

// API Routes for managing the mantor database
Route::middleware('role:admin')->group(function () {
    Route::get('/{startupId}', [MilestonesController::class, 'index']);
    Route::put('/{id}', [MilestonesController::class, 'update']); // Update a specific startup
    Route::get('/get/{id}', [MilestonesController::class, 'show']); // Assign a mentor to a startup
});
