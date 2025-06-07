<?php

namespace App\Http\Controllers;

use App\Models\Stats;
use App\Models\Advisor;

use function Pest\Laravel\json;

class Controller
{
    // Function That Get Statistiques
    function indexStats()
    {
        try {
            $stats = Stats::all();
            return response()->json([
                "success" => true,
                "data" => $stats
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                "success" => false,
                "error" => $th->getMessage()
            ]);
        }
    }

    function index_adv()
    {
        try {
            $advisors = Advisor::all();

            if (!$advisors) {
                return response()->json([
                    'status' => false,
                    'message' => 'No Advisors',
                ]);
            }

            return response()->json([
                'status' => true,
                'data' => $advisors,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ]);
        }
    }
}
