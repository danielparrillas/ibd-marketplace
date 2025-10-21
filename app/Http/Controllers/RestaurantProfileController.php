<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Restaurant;

class RestaurantProfileController extends Controller
{
public function edit()
    {
        $restaurant = Restaurant::where('user_id', Auth::id())->firstOrFail();

        return Inertia::render('restaurant/profile/profile', [
            'restaurant' => $restaurant,
        ]);
    }

    public function update(Request $request)
    {
        $restaurant = Restaurant::where('user_id', Auth::id())->firstOrFail();

        $validated = $request->validate([
            'responsible_name' => 'required|string|max:255',
            'business_name' => 'required|string|max:255',
            'legal_name' => 'nullable|string|max:255',
            'phone' => 'required|string|max:20',
            'legal_document' => 'nullable|string|max:100',
            'business_license' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'logo_url' => 'nullable|url|max:500',
        ]);

        $restaurant->update($validated);

        return back()->with('success', 'Restaurant profile updated.');
    }
}
