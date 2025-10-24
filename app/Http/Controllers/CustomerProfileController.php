<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Customer;

class CustomerProfileController extends Controller
{
    public function edit()
    {
        $customer = Customer::where('user_id', Auth::id())->firstOrFail();

        return Inertia::render('customer/profile', [
            'customer' => $customer,
        ]);
    }

    public function update(Request $request)
    {
        $customer = Customer::where('user_id', Auth::id())->firstOrFail();

        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'phone' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
        ]);

        $customer->update($validated);

        return back()->with('success', 'Perfil actualizado correctamente.');
    }
}
