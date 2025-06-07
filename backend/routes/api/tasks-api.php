<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TasksController;


Route::middleware('role:student,admin')->group(function () {
    Route::get('/startup/{startupId}', [TasksController::class, 'getTasksByStartup']);
    Route::get('/Student/{student_id}', [TasksController::class, 'getTasksByStudent']);
    Route::post('/', [TasksController::class, 'store']);
    Route::put('/{id}', [TasksController::class, 'update']);
    Route::get('/{id}', [TasksController::class, 'destroy']);
});
