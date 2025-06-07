<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NoteController;

Route::middleware('role:student,admin')->group(function () {
    Route::get('/{startupId}', [NoteController::class, 'index']);
    Route::post('/', [NoteController::class, 'store']);    // Create a new note
    Route::put('/{id}', [NoteController::class, 'update']); // Update a specific note
    Route::delete('/{id}', [NoteController::class, 'destroy']); // Delete a specific note
    Route::get('/get/{id}', [NoteController::class, 'show']);   // Get a specific note
});
