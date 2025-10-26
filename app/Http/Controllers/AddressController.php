<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Address;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class AddressController extends Controller
{
    use AuthorizesRequests; 

    public function index()
    {
        $addresses = Address::where('user_id', Auth::id())->get();

        return Inertia::render('customer/addresses/index', [
            'addresses' => $addresses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'delivery_instructions' => 'nullable|string',
        ]);

        $validated['user_id'] = Auth::id();

        Address::create($validated);

        return redirect()->route('addresses.index')->with('success', 'Dirección agregada correctamente.');
    }

    public function update(Request $request, string $id)
    {
        $userId = Auth::id();
        $validated = $request->validate([
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'delivery_instructions' => 'nullable|string',
        ]);

        // Busca la dirección del usuario autenticado
        $address = Address::where('user_id', $userId)
            ->where('id', $id)
            ->firstOrFail();
        $address->update($validated);

        return back()->with('success', 'Dirección actualizada correctamente.');
    }

/*     public function destroy(Address $address)
    {
        $this->authorize('delete', $address);
        $address->delete();

        return back()->with('success', 'Dirección eliminada correctamente.');
    } */
   	public function destroy(string $id)
	{
		$userId = Auth::id();
		//$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		$address = Address::where('id', $id)
			->where('user_id', $userId)
			->firstOrFail();

		$address->delete();

		return back()->with('success', "Dirección eliminada exitosamente.");
	}
}
