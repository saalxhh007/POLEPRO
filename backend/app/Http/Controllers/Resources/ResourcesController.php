<?php

namespace App\Http\Controllers\Resources;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Resources;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ResourcesController extends Controller
{
    // Get All Resources
    function index()
    {
        $resources = Resources::all();
        if ($resources->isEmpty()) {
            return response()->json([
                "success" => false,
                "message" => "No Resources Found",
            ]);
        }
        return response()->json([
            "success" => true,
            "data" => $resources
        ], Response::HTTP_OK);
    }

    // Create A Resource
    function store(Request $req)
    {
        try {
            $data = $req->validate([
                'name' => 'required',
                'type' => 'required',
                'capacity' => 'required',
                'availability' => 'required',
                "emplacement" => "required"
            ]);

            $resource = Resources::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Resource Created Successfully',
                'data' => $resource
            ], Response::HTTP_CREATED);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error Creating Resource',
                'error' => $th->getMessage()
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    function show($id)
    {
        $resource = Resources::find($id);

        if (!$resource) {
            return response()->json([
                "success" => false,
                'message' => 'Resource not found'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json($resource, Response::HTTP_OK);
    }
    function update($id)
    {
        try {
            $resource = Resources::find($id);

            if (!$resource) {
                return response()->json(['message' => 'Resource not found'], Response::HTTP_NOT_FOUND);
            }

            $data = request()->validate([
                'name' => 'sometimes|required|string|max:255',
                'type' => 'sometimes|nullable|string|max:100',
                'capacity' => 'sometimes|nullable|string|max:100',
                'availability' => 'sometimes|required|in:available,booked',
                'utilization' => 'sometimes|nullable|integer',
                'emplacement' => 'sometimes|nullable|string|max:100',
            ]);

            $resource->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Resource updated successfully',
                'data' => $resource
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating resource',
                'error' => $th->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    function destroy($id)
    {
        $resource = Resources::find($id);

        if (!$resource) {
            return response()->json([
                "success" => false,
                'message' => 'Resource not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $resource->delete();

        return response()->json([
            "success" => true,
            'message' => 'Resource deleted successfully'
        ], Response::HTTP_OK);
    }

    function available()
    {
        $resources = Resources::where("availability", "available")->get();
        if ($resources->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No Available Resources Found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Available Mentors Retrieved Successfully',
            'data' => $resources,
        ]);
    }

    function booking(Request $req, $id)
    {
        try {

            $resource = Resources::find($id);
            if (!$resource) {
                return response()->json(['message' => 'Resource not found'], Response::HTTP_NOT_FOUND);
            }
            $data = $req->validate([
                'start_date' => 'required|date|after_or_equal:today',
                'end_date' => 'required|date|after:start_date',
                'start_time' => 'required|date_format:H:i',
                'end_time' => 'required|date_format:H:i|after:start_time',
                'purpose' => 'nullable|string|max:100',
                'notes' => 'nullable|string',
            ]);

            $data["start_date"] = Carbon::parse($data['start_date'])->toDateString();
            $data["end_date"] = Carbon::parse($data['end_date'])->toDateString();
            $data["resource_id"] = $id;
            $booking = Booking::create($data);

            $resource->availability = 'booked';
            $resource->save();


            return response()->json([
                'success' => true,
                'message' => 'Resource booked successfully',
                'data' => $booking
            ], Response::HTTP_CREATED);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error booking resource',
                'error' => $th->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


    public function allbooking($id)
    {
        try {
            $resource = Resources::find($id);
            if (!$resource) {
                return response()->json(['message' => 'Resource not found'], Response::HTTP_NOT_FOUND);
            }

            $bookings = Booking::where('resource_id', $id)->get();

            return response()->json([
                'success' => true,
                'data' => $bookings,
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching bookings',
                'error' => $th->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
