<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Event\EventController;


// API Routes for managing the event database (everyone has access)
Route::get('/', [EventController::class, 'index']); // Get all events
Route::get('/upcoming', [EventController::class, 'upcoming']); // Get all upcoming events
Route::get('/{id}', [EventController::class, 'show']); // Get a specific event

// only admin
Route::middleware('role:admin')->group(function () {
    Route::post('/events', [EventController::class, 'store']); // Create event
    Route::put('/events/{id}', [EventController::class, 'update']); // Update event
    Route::delete('/events/{id}', [EventController::class, 'destroy']); // Delete event
    Route::post("/share/facebook", [EventController::class, "shareToFacebook"]); // Share an event
});
