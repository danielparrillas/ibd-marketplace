<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class RestaurantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
       // return "Lista de restaurantes";
                      return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
         //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $userId = auth()->user()->id;
        $validation = $request->validate([
            'business_name' => 'required|string|max:255',
            'legal_name' => 'string|max:255',
            'phone' => 'required|string|max:20',
            'legal_document' => 'string|max:100',
            'business_license' => 'string|max:100',
            'description' => 'string|max:255',
            'logo_url' => 'string|max:500',
        ]);

        $restaurant = new Restaurant();
        $restaurant->user_id = $userId;
        $restaurant->business_name = $request->input('business_name');
        $restaurant->legal_name = $request->input('legal_name');
        $restaurant->phone = $request->input('phone');
        $restaurant->legal_document = $request->input('legal_document');
        $restaurant->business_license = $request->input('business_license');
        $restaurant->description = $request->input('description');
        $restaurant->logo_url = $request->input('logo_url');
        $restaurant->save();

        return back()->with('success', 'Cliente registrado exitosamente.'); 
    }

    /**
     * Display the specified resource.
     */
    public function show(Restaurant $restaurant): Response
    {
        $restaurant->load(['dishes' => function ($query) {
            $query->available()->orderBy('category')->orderBy('name');
        }]);

        $restaurantData = [
            'id' => $restaurant->id,
            'business_name' => $restaurant->business_name,
            'description' => $restaurant->description,
            'logo_url' => $this->formatMediaPath($restaurant->logo_url),
            'phone' => $restaurant->phone,
            'minimum_order' => $restaurant->minimum_order ?? null,
            'food_type' => $restaurant->food_type ?? null,
            'location_city' => $restaurant->location_city ?? null,
            'delivery_fee' => $restaurant->delivery_fee ?? null,
            'delivery_radius' => $restaurant->delivery_radius ?? null,
            'rating' => $restaurant->rating ?? null,
        ];

        $dishesData = $restaurant->dishes->map(function ($dish) {
            return [
                'id' => $dish->id,
                'name' => $dish->name,
                'description' => $dish->description ?? '',
                'price' => (float) $dish->price,
                'category' => $dish->category ?? 'General',
                'is_available' => (bool) $dish->is_available,
                'image_url' => $this->formatMediaPath($dish->image_url),
                'preparation_time' => $dish->preparation_time ?? 0,
                'calories' => $dish->calories ?? 0,
                'allergens' => $dish->allergens,
            ];
        })->values()->all();

        return Inertia::render('restaurants/show', [
            'restaurant' => $restaurantData,
            'dishes' => $dishesData,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request): Response
    {
               return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

        private function formatMediaPath(?string $path): ?string
        {
            if (! $path) {
                return null;
            }

            if (Str::startsWith($path, ['http://', 'https://', '/storage'])) {
                return $path;
            }

            return '/storage/'.ltrim($path, '/');
        }
}
