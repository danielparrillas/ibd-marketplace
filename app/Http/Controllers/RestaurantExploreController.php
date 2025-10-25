<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use Inertia\Inertia;
use Illuminate\Http\Request;

class RestaurantExploreController extends Controller
{
    public function index(Request $request)
    {
        // Ejemplo simple: paginación con 12 por página
        $restaurants = Restaurant::select('id', 'business_name', 'logo_url', 'phone')
            ->orderBy('business_name')
            ->paginate(12)
            ->through(function ($r) {
                // Normaliza logos si los guardas relativos (opcional)
                if (!empty($r->logo_url) && !str_starts_with($r->logo_url, '/storage') && !str_starts_with($r->logo_url, 'http')) {
                    $r->logo_url = '/storage/' . ltrim($r->logo_url, '/');
                }
                return $r;
            });

        return Inertia::render('restaurants/explore', [
            'restaurants' => $restaurants,
            // Puedes pasar filtros, términos de búsqueda, etc.
        ]);
    }
}