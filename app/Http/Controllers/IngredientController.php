<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IngredientController extends Controller
{
	public function index()
	{
		$userId = Auth::id();
		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		$ingredients = Ingredient::where('restaurant_id', $restaurantId)->get();

		return inertia('restaurant/ingredients/ingredients', [
			'ingredients' => $ingredients,
		]);
	}

	public function create()
	{
		return 'create';
	}

	public function store(Request $request)
	{
		$userId = Auth::id();

		$request->validate([
			'name' => 'required|string|max:255',
			'unit_measure' => 'required|string|max:50',
			'current_stock' => 'nullable|numeric|min:0',
			'min_stock_alert' => 'nullable|numeric|min:0',
			'unit_cost' => 'nullable|numeric|min:0',
			'supplier' => 'nullable|string|max:255',
			'expiration_date' => 'nullable|date',
		]);

		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		$ingredient = new Ingredient();
		$ingredient->restaurant_id = $restaurantId;
		$ingredient->name = $request->input('name');
		$ingredient->unit_measure = $request->input('unit_measure');
		$ingredient->current_stock = $request->input('current_stock', 0);
		$ingredient->min_stock_alert = $request->input('min_stock_alert', 0);
		$ingredient->unit_cost = $request->input('unit_cost');
		$ingredient->supplier = $request->input('supplier');
		$ingredient->expiration_date = $request->input('expiration_date');
		$ingredient->save();

		return back()->with('success', 'Ingrediente registrado exitosamente.');
	}

	public function show(string $id)
	{
		return 'show';
	}

	public function edit(string $id)
	{
		return 'edit';
	}

	public function update(Request $request, string $id)
	{
		$userId = Auth::id();

		$request->validate([
			'name' => 'required|string|max:255',
			'unit_measure' => 'required|string|max:50',
			'current_stock' => 'nullable|numeric|min:0',
			'min_stock_alert' => 'nullable|numeric|min:0',
			'unit_cost' => 'nullable|numeric|min:0',
			'supplier' => 'nullable|string|max:255',
			'expiration_date' => 'nullable|date',
		]);

		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		$ingredient = Ingredient::where('id', $id)
			->where('restaurant_id', $restaurantId)
			->firstOrFail();

		$ingredient->name = $request->input('name');
		$ingredient->unit_measure = $request->input('unit_measure');
		$ingredient->current_stock = $request->input('current_stock', 0);
		$ingredient->min_stock_alert = $request->input('min_stock_alert', 0);
		$ingredient->unit_cost = $request->input('unit_cost');
		$ingredient->supplier = $request->input('supplier');
		$ingredient->expiration_date = $request->input('expiration_date');
		$ingredient->save();

		return back()->with('success', 'Ingrediente actualizado exitosamente.');
	}

	public function destroy(string $id)
	{
		$userId = Auth::id();
		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		$ingredient = Ingredient::where('id', $id)
			->where('restaurant_id', $restaurantId)
			->firstOrFail();

		$ingredient->delete();

		return back()->with('success', 'Ingrediente eliminado exitosamente.');
	}

	public function search(Request $request)
	{
		return 'search';
	}
}
