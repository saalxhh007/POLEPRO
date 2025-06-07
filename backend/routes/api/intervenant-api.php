<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Intervenant\IntervenantController;

Route::post('/', [IntervenantController::class, 'store']);
Route::delete('/{id}', [IntervenantController::class, 'destroy']);
Route::put('/{id}', [IntervenantController::class, 'update']);
Route::get('/', [IntervenantController::class, 'index']);
Route::get('/event/{eventId}', [IntervenantController::class, 'eventIntervenants']);

Route::middleware('role:admin')->group(function () {
    Route::get('/{id}', [IntervenantController::class, 'show']);
});
