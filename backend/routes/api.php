<?php

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Route;

Route::middleware("role:admin")->group(function () {
    Route::get("/advisors", [Controller::class, "index_adv"]); // Get All Advisors
});
// User
Route::prefix("user")->group(function () {
    require base_path("routes/api/user-api.php");
});

// Startup 
// Startup api'a
Route::prefix("startup")->group(function () {
    require base_path("routes/api/startup-api.php");
});
// Teams Api's
Route::prefix("team")->group(function () {
    require base_path("routes/api/team-api.php"); // Team Api's
});
// Mentor Api's
Route::prefix("mentor")->group(function () {
    require base_path("routes/api/mentor-api.php"); // Mentor Api's
});
Route::prefix("milestone")->group(function () {
    require base_path("routes/api/milestone-api.php");
});
Route::prefix("tasks")->group(function () {
    require base_path("routes/api/tasks-api.php");
});
Route::prefix("notes")->group(function () {
    require base_path("routes/api/notes-api.php");
});

// Event
// Event Api's
Route::prefix("event")->group(function () {
    require base_path("routes/api/event-api.php");
});
// Participant Api's
Route::prefix("participant")->group(function () {
    require base_path("routes/api/participant-api.php");
});
// Resources Api's
Route::prefix("resource")->group(function () {
    require base_path("routes/api/resource-api.php");
});
// intervenant api's
Route::prefix("intervenant")->group(function () {
    require base_path("routes/api/intervenant-api.php");
});
// Meeting
// Meeting Api's
Route::prefix("meeting")->group(function () {
    require base_path("routes/api/meeting-api.php");
});

// More
Route::get('/stats', [Controller::class, 'indexStats']); // Get all stats
