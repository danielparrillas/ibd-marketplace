<?php

namespace App\Http\Controllers;

use App\Models\Restaurant;
use Illuminate\Http\Request;
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
    public function show(string $id)
    {
        //
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
}
