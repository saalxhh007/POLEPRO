<?php

namespace App\Http\Controllers\Meeting;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use Carbon\Carbon;
use Illuminate\Http\Request;

class MeetingController extends Controller
{
    function store(Request $req)
    {
        try {
            $data = $req->validate([
                'mentor_id' => 'required|exists:mentors,id',
                'team_id' => 'required|exists:teams,id',
                "title" => "nullable|string",
                "description" => "nullable|string",
                "duration" => "nullable|string",
                "type" => "required|string",
                'date' => 'required|date|after:now',
                'time' => 'required|string',
            ]);

            $data['date'] = Carbon::parse($data['date'])->toDateString();

            $meeting = Meeting::create($data);
            return response()->json([
                'success' => true,
                'message' => 'Meeting scheduled',
                'meeting' => $meeting
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'error' => $th->getMessage()
            ]);
        }
    }

    function index($id) {
        
    }
    public function destroy()
    {
        Meeting::where('status', 'completed')
            ->where('date', '<', now()->subDays(1))
            ->delete();
    }
}
