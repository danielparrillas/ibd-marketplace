<?php

namespace App\Http\Controllers;

use App\Models\Combo;
use App\Models\ComboDish;
use App\Models\Dish;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ComboDishController extends Controller
{
	public function index(string $comboId)
	{
		$userId = Auth::id();
		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		// Verificar que el combo pertenece al restaurante del usuario
		$combo = Combo::where('id', $comboId)
			->where('restaurant_id', $restaurantId)
			->firstOrFail();

		$comboDishes = ComboDish::with('dish')
			->where('combo_id', $comboId)
			->get();

		// Obtener todos los platillos disponibles para el restaurante
		$availableDishes = Dish::where('restaurant_id', $restaurantId)
			->whereNotIn('id', function ($query) use ($comboId) {
				$query->select('dish_id')
					->from('combo_dishes')
					->where('combo_id', $comboId);
			})
			->get();

		return inertia('restaurant/combos/combo-dishes', [
			'combo' => $combo,
			'comboDishes' => $comboDishes,
			'availableDishes' => $availableDishes,
			'success' => session('success'),
			'warning' => session('warning')
		]);
	}

	public function store(Request $request, string $comboId)
	{
		$userId = Auth::id();

		$request->validate([
			'dish_id' => 'required|exists:dishes,id',
			'quantity' => 'required|integer|min:1',
		]);

		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		// Verificar que el combo pertenece al restaurante del usuario
		$combo = Combo::where('id', $comboId)
			->where('restaurant_id', $restaurantId)
			->firstOrFail();

		// Verificar que el platillo pertenece al restaurante del usuario
		$dish = Dish::where('id', $request->input('dish_id'))
			->where('restaurant_id', $restaurantId)
			->firstOrFail();

		// Verificar que no exista ya esta combinación
		$exists = ComboDish::where('combo_id', $comboId)
			->where('dish_id', $request->input('dish_id'))
			->exists();

		if ($exists) {
			return back()->withErrors(['dish' => 'Este platillo ya está asignado al combo.']);
		}

		$comboDish = new ComboDish();
		$comboDish->combo_id = $comboId;
		$comboDish->dish_id = $request->input('dish_id');
		$comboDish->quantity = $request->input('quantity');
		$comboDish->save();

		return back()->with('success', 'Platillo agregado al combo exitosamente.');
	}

	public function update(Request $request, string $comboId, string $id)
	{
		$userId = Auth::id();

		$request->validate([
			'quantity' => 'required|integer|min:1',
		]);

		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		// Verificar que el combo pertenece al restaurante del usuario
		$combo = Combo::where('id', $comboId)
			->where('restaurant_id', $restaurantId)
			->firstOrFail();

		// Buscar el registro de ComboDish
		$comboDish = ComboDish::where('id', $id)
			->where('combo_id', $comboId)
			->firstOrFail();

		$comboDish->quantity = $request->input('quantity');
		$comboDish->save();

		return back()->with('success', 'Cantidad del platillo actualizada exitosamente.');
	}

	public function destroy(string $comboId, string $id)
	{
		$userId = Auth::id();
		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		// Verificar que el combo pertenece al restaurante del usuario
		$combo = Combo::where('id', $comboId)
			->where('restaurant_id', $restaurantId)
			->firstOrFail();

		// Buscar el registro de ComboDish
		$comboDish = ComboDish::where('id', $id)
			->where('combo_id', $comboId)
			->firstOrFail();

		$comboDish->delete();

		return back()->with('success', 'Platillo eliminado del combo exitosamente.');
	}

	public function get(string $comboId)
	{
		$userId = Auth::id();
		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return response()->json(['error' => 'No se encontró un restaurante asociado al usuario.'], 404);
		}

		// Verificar que el combo pertenece al restaurante del usuario
		$combo = Combo::where('id', $comboId)
			->where('restaurant_id', $restaurantId)
			->first();

		if (!$combo) {
			return response()->json(['error' => 'Combo no encontrado.'], 404);
		}

		$comboDishes = ComboDish::with('dish')
			->where('combo_id', $comboId)
			->get();

		return response()->json($comboDishes);
	}
}
