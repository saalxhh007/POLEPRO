<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Event\EventController;


// API Routes for managing the event database (everyone has access)
Route::get('/', [EventController::class, 'index']); // Get all events
Route::get('/upcoming', [EventController::class, 'upcoming']); // Get all upcoming events
Route::get('/{id}', [EventController::class, 'show']); // Get a specific event
Route::get('/fiche-poster/{eventId}', [EventController::class, 'eventPoster']);
Route::post('/comment', [EventController::class, 'comment']);
Route::get('/comments/{eventId}', [EventController::class, 'allComments']);


// only admin
Route::middleware('role:admin')->group(function () {
    Route::post('/participants/{id}', [EventController::class, 'participants']); // Get Events Participants
    Route::post('/intervenants/{id}', [EventController::class, 'intervenants']); // Get Events Intervenants
    Route::post('/', [EventController::class, 'store']); // Create event
    Route::put('/{id}', [EventController::class, 'update']); // Update event
    Route::delete('/{id}', [EventController::class, 'destroy']); // Delete event
    Route::post("/share/facebook", [EventController::class, "shareToFacebook"]); // Share an event
});
