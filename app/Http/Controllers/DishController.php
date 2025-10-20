<?php

namespace App\Http\Controllers;

use App\Models\Dish;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DishController extends Controller
{
	public function index()
	{
		$userId = Auth::id();
		$restaurantId = Restaurant::where('user_id', $userId)->value('id');
		$success = session('success');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		$dishes = Dish::where('restaurant_id', $restaurantId)->get();

		return inertia('restaurant/dishes/dishes', [
			'dishes' => $dishes,
			'success' => $success,
		]);
	}

	public function create()
	{
		// No hay una vista separada para crear platillos; el formulario está en la vista de índice.
		return 'create';
	}

	public function store(Request $request)
	{
		$userId = Auth::id();

		$request->validate([
			'name' => 'required|string|max:255',
			'description' => 'nullable|string',
			'price' => 'required|numeric|min:0',
			'category' => 'required|string|max:100',
			// 'image_url' => 'nullable|string|max:500',
			'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
			'preparation_time' => 'required|integer|min:0',
			'is_available' => 'nullable|boolean',
			'is_featured' => 'nullable|boolean',
			'calories' => 'nullable|integer|min:0',
			'allergens' => 'nullable|string',
		]);

		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		$dish = new Dish();
		$dish->restaurant_id = $restaurantId;
		$dish->name = $request->input('name');
		$dish->description = $request->input('description');
		$dish->price = $request->input('price');
		$dish->category = $request->input('category');
		// $dish->image_url = $request->input('image_url');
		// Manejo de carga de imagen
		if ($request->hasFile('image_url')) {
			$image = $request->file('image_url');
			$path = $image->store('dishes', 'public');
			$dish->image_url = '/storage/' . $path;
		} else {
			$dish->image_url = null;
		}
		// Fin del manejo de carga de imagen
		$dish->preparation_time = $request->input('preparation_time');
		$dish->is_available = $request->has('is_available');
		$dish->is_featured = $request->has('is_featured');
		$dish->calories = $request->input('calories');
		$dish->allergens = $request->input('allergens');
		$dish->save();

		return back()->with('success', 'Platillo registrado exitosamente.');
	}

	public function show(string $id)
	{
		// No hay una vista separada para mostrar un platillo; la funcionalidad no está implementada.
		return 'show';
	}

	public function edit(string $id)
	{
		// No hay una vista separada para editar platillos; el formulario está en la vista de índice.
		return 'edit';
	}

	public function update(Request $request, string $id)
	{
		$userId = Auth::id();

		$request->validate([
			'name' => 'required|string|max:255',
			'description' => 'nullable|string',
			'price' => 'required|numeric|min:0',
			'category' => 'required|string|max:100',
			'image_url' => 'nullable|string|max:500',
			'preparation_time' => 'required|integer|min:0',
			'is_available' => 'nullable|boolean',
			'is_featured' => 'nullable|boolean',
			'calories' => 'nullable|integer|min:0',
			'allergens' => 'nullable|string',
		]);

		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		$dish = Dish::where('id', $id)
			->where('restaurant_id', $restaurantId)
			->firstOrFail();

		$dish->name = $request->input('name');
		$dish->description = $request->input('description');
		$dish->price = $request->input('price');
		$dish->category = $request->input('category');
		$dish->image_url = $request->input('image_url');
		$dish->preparation_time = $request->input('preparation_time');
		$dish->is_available = $request->input('is_available', true);
		$dish->is_featured = $request->input('is_featured', false);
		$dish->calories = $request->input('calories');
		$dish->allergens = $request->input('allergens');
		$dish->save();

		return back()->with('success', 'Platillo actualizado exitosamente.');
	}

	public function destroy(string $id)
	{
		$userId = Auth::id();
		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		$dish = Dish::where('id', $id)
			->where('restaurant_id', $restaurantId)
			->firstOrFail();

		$dish->delete();

		return back()->with('success', 'Platillo eliminado exitosamente.');
	}

	public function get(Request $request)
	{
		return response()->json(Dish::all());
	}

	public function uploadImage(Request $request, $id)
	{
		$userId = Auth::id();

		info($request);

		$request->validate([
			'image_url' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
		]);

		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		$dish = Dish::where('id', $id)
			->where('restaurant_id', $restaurantId)
			->firstOrFail();

		$prev_image = $dish->image_url;

		if ($request->hasFile('image_url')) {
			$image = $request->file('image_url');
			$path = $image->store('dishes', 'public');
			$dish->image_url = '/storage/' . $path;
		} else {
			$dish->image_url = null;
		}

		// Eliminar imagen anterior
		if ($prev_image && file_exists(public_path($prev_image))) {
			unlink(public_path($prev_image));
		}

		$dish->save();

		return back()->with('success', 'Platillo actualizado exitosamente.');
	}
}
