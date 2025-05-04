<?php

namespace App\Http\Controllers\Intervenant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Intervenant;
use Illuminate\Http\Response;

class IntervenantController extends Controller
{
    // Get All Intervenant
    function index()
    {
        $intervenants = Intervenant::all();
        if ($intervenants->isEmpty()) {
            return response()->json([
                "success" => false,
                "message" => "No Intervenant Found",
            ]);
        }
        return response()->json([
            "success" => true,
            "data" => $intervenants
        ], Response::HTTP_OK);
    }
    // Create A Intervenant
    function store(Request $req)
    {
        try {
            $data = $req->validate([
                'name' => 'required',
                'bio' => 'required',
                'contact_info' => 'required',
            ]);

            $intervenant = Intervenant::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Intervenant Created Successfully',
                'data' => $intervenant
            ], Response::HTTP_CREATED);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Error Creating Intervenant',
                'error' => $th->getMessage()
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    function show($id)
    {
        $intervenant = Intervenant::find($id);

        if (!$intervenant) {
            return response()->json(['message' => 'Intervenant not found'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($intervenant, Response::HTTP_OK);
    }
    function update($id)
    {

        try {
            $intervenant = Intervenant::find($id);

            if (!$intervenant) {
                return response()->json(['message' => 'Intervenant not found'], Response::HTTP_NOT_FOUND);
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
                'message' => 'Error Updating Intervenant',
                'error' => $th->getMessage()
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    function destroy($id)
    {
        $intervenant = Intervenant::find($id);

        if (!$intervenant) {
            return response()->json([
                "success" => false,
                'message' => 'Intervenant not found'
            ], Response::HTTP_NOT_FOUND);
        }

        $intervenant->delete();

        return response()->json([
            "success" => true,
            'message' => 'Intervenant deleted successfully'
        ], Response::HTTP_OK);
    }
}
