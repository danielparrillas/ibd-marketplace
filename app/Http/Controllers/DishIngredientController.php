<?php

namespace App\Http\Controllers;

use App\Models\Dish;
use App\Models\DishIngredient;
use App\Models\Ingredient;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DishIngredientController extends Controller
{
	public function index(string $dishId)
	{
		$userId = Auth::id();
		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		// Verificar que el platillo pertenece al restaurante del usuario
		$dish = Dish::where('id', $dishId)
			->where('restaurant_id', $restaurantId)
			->firstOrFail();

		$dishIngredients = DishIngredient::with('ingredient')
			->where('dish_id', $dishId)
			->with('ingredient')
			->get();

		// Obtener todos los ingredientes disponibles para el restaurante
		$availableIngredients = Ingredient::where('restaurant_id', $restaurantId)->get();

		return inertia('restaurant/dishes/dish-ingredients', [
			'dish' => $dish,
			'dishIngredients' => $dishIngredients,
			'availableIngredients' => $availableIngredients,
			'success' => session('success'),
			'warning' => session('warning')
		]);
	}

	public function store(Request $request, string $dishId)
	{
		$userId = Auth::id();

		$request->validate([
			'ingredient_id' => 'required|exists:ingredients,id',
			'quantity_needed' => 'required|numeric|min:0',
		]);

		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		// Verificar que el platillo pertenece al restaurante del usuario
		$dish = Dish::where('id', $dishId)
			->where('restaurant_id', $restaurantId)
			->firstOrFail();

		// Verificar que el ingrediente pertenece al restaurante del usuario
		$ingredient = Ingredient::where('id', $request->input('ingredient_id'))
			->where('restaurant_id', $restaurantId)
			->firstOrFail();

		// Verificar que no exista ya esta combinación
		$exists = DishIngredient::where('dish_id', $dishId)
			->where('ingredient_id', $request->input('ingredient_id'))
			->exists();

		if ($exists) {
			return back()->withErrors(['ingredient' => 'Este ingrediente ya está asignado al platillo.']);
		}

		$dishIngredient = new DishIngredient();
		$dishIngredient->dish_id = $dishId;
		$dishIngredient->ingredient_id = $request->input('ingredient_id');
		$dishIngredient->quantity_needed = $request->input('quantity_needed');
		$dishIngredient->save();

		return back()->with('success', 'Ingrediente agregado al platillo exitosamente.');
	}

	public function update(Request $request, string $dishId, string $id)
	{
		$userId = Auth::id();

		$request->validate([
			'quantity_needed' => 'required|numeric|min:0',
		]);

		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		// Verificar que el platillo pertenece al restaurante del usuario
		$dish = Dish::where('id', $dishId)
			->where('restaurant_id', $restaurantId)
			->firstOrFail();

		// Buscar el registro de DishIngredient
		$dishIngredient = DishIngredient::where('id', $id)
			->where('dish_id', $dishId)
			->firstOrFail();

		$dishIngredient->quantity_needed = $request->input('quantity_needed');
		$dishIngredient->save();

		return back()->with('success', 'Cantidad del ingrediente actualizada exitosamente.');
	}

	public function destroy(string $dishId, string $id)
	{
		$userId = Auth::id();
		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		// Verificar que el platillo pertenece al restaurante del usuario
		$dish = Dish::where('id', $dishId)
			->where('restaurant_id', $restaurantId)
			->firstOrFail();

		// Buscar el registro de DishIngredient
		$dishIngredient = DishIngredient::where('id', $id)
			->where('dish_id', $dishId)
			->firstOrFail();

		$dishIngredient->delete();

		return back()->with('success', 'Ingrediente eliminado del platillo exitosamente.');
	}

	public function get(string $dishId)
	{
		$userId = Auth::id();
		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return response()->json(['error' => 'No se encontró un restaurante asociado al usuario.'], 404);
		}

		// Verificar que el platillo pertenece al restaurante del usuario
		$dish = Dish::where('id', $dishId)
			->where('restaurant_id', $restaurantId)
			->first();

		if (!$dish) {
			return response()->json(['error' => 'Platillo no encontrado.'], 404);
		}

		$dishIngredients = DishIngredient::with('ingredient')
			->where('dish_id', $dishId)
			->get();

		return response()->json($dishIngredients);
	}
}
