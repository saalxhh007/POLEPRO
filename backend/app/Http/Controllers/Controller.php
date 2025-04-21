<?php

namespace App\Http\Controllers;

use App\Models\Stats;

class Controller
{
    // Function That Get Statistiques
    function index()
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
}
