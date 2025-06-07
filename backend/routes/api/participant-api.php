<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ParticipantsController;

// API Routes for managing the participants database (everyone has access)
Route::post('/submit-form', [ParticipantsController::class, 'submit']);
Route::get('/check-in/{token}', [ParticipantsController::class, 'check_in']);
Route::get('/intervenants/{eventId}', [ParticipantsController::class, 'showEventIntervenants']);

// only admin
Route::middleware('role:admin')->group(function () {
    Route::post('/admin/approve/{id}', [ParticipantsController::class, 'approve']);
    Route::post('/admin/delete-form/', [ParticipantsController::class, 'deleteAll']);
    Route::get('/all/{eventId}', [ParticipantsController::class, 'showEventParticipants']);
    Route::get('/export', [ParticipantsController::class, 'exportParticipantsCSV']);
    Route::post('/send-reminders', [ParticipantsController::class, 'sendReminders']);
    Route::post('/add/{eventId}', [ParticipantsController::class, 'add']);
    Route::delete('/delete/{eventId}/{participantId}', [ParticipantsController::class, 'delete']);
});
