<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Intervenant\IntervenantController;

// API Routes for managing the Intervenant database
Route::prefix('')->group(function () {
    Route::get('/', [IntervenantController::class, 'index']); // Get all Intervenant
    Route::post('/', [IntervenantController::class, 'store']); // Create a new Intervenant
    Route::get('/{id}', [IntervenantController::class, 'show']); // Get a specific Intervenant
    Route::put('/{id}', [IntervenantController::class, 'update']); // Update a specific Intervenant
    Route::delete('/{id}', [IntervenantController::class, 'destroy']); // Delete a specific Intervenant
});
