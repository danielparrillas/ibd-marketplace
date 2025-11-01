<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RestaurantDashboardController extends Controller
{
        public function index()
    {
        return Inertia::render('restaurants/dashboard'); // nombre exacto de tu componente React/TSX
    }
    public function showDashboard(Request $request)
    {
        $userId = $request->user()->id;

        // Llamada a cada SP, pasando el userId para filtrar por restaurante
        $salesByDish = DB::select('EXEC sp_sales_by_dish @userId = ?', [$userId]);
        $lowInventory = DB::select('EXEC sp_low_inventory @userId = ?', [$userId]);
        $ordersLast7Days = DB::select('EXEC sp_orders_last_7_days @userId = ?', [$userId]);
        $salesTotalLast7Days = DB::select('EXEC sp_sales_total_last_7_days @userId = ?', [$userId]);
        $topCombos = DB::select('EXEC sp_top_combos @userId = ?', [$userId]);

        // Opcional: puedes transformar datos aquí si necesitas formato especial para frontend

        return response()->json([
            'salesByDish' => $salesByDish,
            'lowInventory' => $lowInventory,
            'ordersLast7Days' => $ordersLast7Days,
            'salesTotalLast7Days' => $salesTotalLast7Days,
            'topCombos' => $topCombos,
        ]);
    }

}
