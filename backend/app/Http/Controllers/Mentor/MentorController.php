<?php

namespace App\Http\Controllers\Mentor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Mentor;
use Illuminate\Http\Response;

class MentorController extends Controller
{
    // Get All Mentors
    function index()
    {
        $mentors = Mentor::all();
        if ($mentors->isEmpty()) {
            return response()->json([
                "success" => false,
                "message" => "No Mentors Found",
            ]);
        }
        return response()->json([
            "success" => true,
            "data" => $mentors
        ], Response::HTTP_OK);
    }
    // Create A Mentor
    function store(Request $req)
    {
        try {
            $data = $req->validate([
                'name' => 'required',
                'email' => 'required',
                'expertise' => 'required',
                'company' => 'required',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            if ($req->hasFile('image')) {
                $imagePath = $req->file('image')->store('mentors', 'public');
                $data['image'] = $imagePath;
            }

            $mentor = Mentor::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Mentor Created Successfully',
                'data' => $mentor
            ], Response::HTTP_CREATED);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error Creating Mentor',
                'error' => $th->getMessage()
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    function show($id)
    {
        $mentor = Mentor::find($id);

        if (!$mentor) {
            return response()->json(['message' => 'Mentor not found'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($mentor, Response::HTTP_OK);
    }

    function update($id)
    {

        try {
            $mantor = Mentor::find($id);

            if (!$mantor) {
                return response()->json(['message' => 'Mentor not found'], Response::HTTP_NOT_FOUND);
            }

            // $data = request()->validate([
            //     'idea_stage' => 'sometimes|required',
            //     'idea' => 'sometimes|required',
            //     'description' => 'sometimes|required',
            //     'innovation' => 'sometimes|required',
            //     'target_customers' => 'sometimes|required',
            //     'originality' => 'sometimes|required',
            //     'sector' => 'sometimes|required',
            //     'other_details' => 'sometimes|required',
            //     'business_model' => 'sometimes|required',
            //     'supervisor_name' => 'sometimes|required',
            //     'submission_date' => 'sometimes|required',
            //     'modified_date' => 'sometimes|required',
            //     'is_final' => 'sometimes|required',
            //     'in_pole' => 'sometimes|required',
            //     'approved_by_dean' => 'sometimes|required',
            //     'faculty_code' => 'sometimes|required',
            //     'advisor_id' => 'sometimes|required',
            //     'advisor_grade' => 'sometimes|required',
            //     'advisor_specialization' => 'sometimes|required',
            //     'advisor_faculty' => 'sometimes|required',
            //     'advisor_department' => 'sometimes|required',
            //     'idea_origin' => 'sometimes|required',
            // ]);

            // $mantor->update($data);

            // return response()->json([
            //     'success' => true,
            //     'message' => 'Mentor Updated Successfully',
            //     'data' => $mentor
            // ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error Updating Mentor',
                'error' => $th->getMessage()
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    function destroy($id)
    {
        $mantor = Mentor::find($id);

        if (!$mantor) {
            return response()->json([
                "success" => false,
                'message' => 'Mentor not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $mantor->delete();

        return response()->json([
            "success" => true,
            'message' => 'Mentor deleted successfully'
        ], Response::HTTP_OK);
    }

    function assignMentor($id)
    {
        $mentor = Mentor::find($id);

        if (!$mentor) {
            return response()->json(['message' => 'Mentor not found'], Response::HTTP_NOT_FOUND);
        }

        // $mentor->update([
        //     'assigned' => true,
        // ]);

        return response()->json(['message' => 'Mentor assigned successfully'], Response::HTTP_OK);
    }
    function available()
    {
        $mentors = Mentor::where("availability", "available")->get();
        if ($mentors->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No Available Mentors Found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Available Mentors Retrieved Successfully',
            'data' => $mentors,
        ]);
    }
}
