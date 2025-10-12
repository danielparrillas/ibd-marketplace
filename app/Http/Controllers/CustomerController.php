<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return "Lista de clientes";
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
    
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'phone' => 'string|max:20',
            'birth_date' => 'date',
        ]);
        
        $customer = new Customer();
        $customer->user_id = $userId;
        $customer->first_name = $request->input('first_name');
        $customer->last_name = $request->input('last_name');
        $customer->phone = $request->input('phone');
        $customer->birth_date = $request->input('birth_date');
        $customer->save();
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
    public function edit(string $id)
    {
        //
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
