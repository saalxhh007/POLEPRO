<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Resources\ResourcesController;

// only admin
Route::get("/booking/{id}", [ResourcesController::class, "allbooking"]); // All The Booking For Resource
Route::middleware('role:admin')->group(function () {
    Route::get('/', [ResourcesController::class, 'index']); // Get All Resources
    Route::get('/{id}', [ResourcesController::class, 'show']); // Create Resource
    Route::post('/', [ResourcesController::class, 'store']); // Create Resource
    Route::put('/{id}', [ResourcesController::class, 'update']); // Update Resource
    Route::delete('/{id}', [ResourcesController::class, 'destroy']); // Delete Resource
    Route::post("/availability", [ResourcesController::class, "available"]); // Update Availability
    Route::post("/booking/{id}", [ResourcesController::class, "booking"]); // Update Availability
});
