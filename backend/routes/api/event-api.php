<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Event\EventController;

// API Routes for managing the event database
Route::prefix('')->group(function () {
    Route::get('/', [EventController::class, 'index']); // Get all events
    Route::get('/upcoming', [EventController::class, 'upcoming']); // Get all upcoming events
    Route::post('/', [EventController::class, 'store']); // Create a new event
    Route::get('/{id}', [EventController::class, 'show']); // Get a specific event
    Route::put('/{id}', [EventController::class, 'update']); // Update a specific event
    Route::delete('/{id}', [EventController::class, 'destroy']); // Delete a specific event
    Route::post("/share", [EventController::class, "shareEvent"]); // Share an event
});
