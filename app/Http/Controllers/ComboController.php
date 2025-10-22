<?php

namespace App\Http\Controllers;

use App\Models\Combo;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ComboController extends Controller
{
	public function index()
	{
		$userId = Auth::id();
		$restaurantId = Restaurant::where('user_id', $userId)->value('id');
		$success = session('success');
		$warning = session('warning');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		$combos = Combo::where('restaurant_id', $restaurantId)
			->withCount('dishes')
			->with('dishes')
			->get()
			->map(function ($combo) {
				return [
					...$combo->toArray(),
					'dishes_count' => (int) $combo->dishes_count,
				];
			});

		return inertia('restaurant/combos/combos', [
			'combos' => $combos,
			'success' => $success,
			'warning' => $warning
		]);
	}

	public function create()
	{
		// No hay una vista separada para crear combos; el formulario está en la vista de índice.
		return 'create';
	}

	public function store(Request $request)
	{
		$userId = Auth::id();

		$request->validate([
			'name' => 'required|string|max:255',
			'description' => 'nullable|string',
			'combo_price' => 'required|numeric|min:0',
			'image_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
			'is_available' => 'nullable|boolean',
			'valid_from' => 'nullable|date',
			'valid_until' => 'nullable|date|after_or_equal:valid_from',
		]);

		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		$combo = new Combo();
		$combo->restaurant_id = $restaurantId;
		$combo->name = $request->input('name');
		$combo->description = $request->input('description');
		$combo->combo_price = $request->input('combo_price');

		// Manejo de carga de imagen
		if ($request->hasFile('image_url')) {
			$image = $request->file('image_url');
			$path = $image->store('combos', 'public');
			$combo->image_url = '/storage/' . $path;
		} else {
			$combo->image_url = null;
		}

		$combo->is_available = $request->has('is_available');
		$combo->valid_from = $request->input('valid_from');
		$combo->valid_until = $request->input('valid_until');
		$combo->save();

		return back()
			->with('success', "Combo {$combo->name} registrado exitosamente.")
			->with('warning', !$combo->image_url ? "Falta agregar una imagen a {$combo->name}" : null);
	}

	public function show(string $id)
	{
		// No hay una vista separada para mostrar un combo; la funcionalidad no está implementada.
		return 'show';
	}

	public function edit(string $id)
	{
		// No hay una vista separada para editar combos; el formulario está en la vista de índice.
		return 'edit';
	}

	public function update(Request $request, string $id)
	{
		$userId = Auth::id();

		$request->validate([
			'name' => 'required|string|max:255',
			'description' => 'nullable|string',
			'combo_price' => 'required|numeric|min:0',
			'is_available' => 'nullable|boolean',
			'valid_from' => 'nullable|date',
			'valid_until' => 'nullable|date|after_or_equal:valid_from',
		]);

		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		$combo = Combo::where('id', $id)
			->where('restaurant_id', $restaurantId)
			->firstOrFail();

		$combo->name = $request->input('name');
		$combo->description = $request->input('description');
		$combo->combo_price = $request->input('combo_price');
		$combo->is_available = $request->has('is_available');
		$combo->valid_from = $request->input('valid_from');
		$combo->valid_until = $request->input('valid_until');
		$combo->save();

		return back()->with('success', "Combo {$combo->name} actualizado exitosamente.");
	}

	public function destroy(string $id)
	{
		$userId = Auth::id();
		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if (!$restaurantId) {
			return back()->withErrors(['restaurant' => 'No se encontró un restaurante asociado al usuario.']);
		}

		$combo = Combo::where('id', $id)
			->where('restaurant_id', $restaurantId)
			->firstOrFail();

		$imagePath = $combo->image_url;

		// Verificar si el combo está asociado a algún pedido antes de eliminar
		$hasOrders = $combo->orderItems()->exists();
		if ($hasOrders) {
			return back()->withErrors(['combo' => 'No se puede eliminar el combo porque está asociado a pedidos existentes.']);
		}

		// Eliminar las relaciones con platillos en la tabla pivot
		$combo->dishes()->detach();

		$combo->delete();

		// Eliminar imagen asociada si existe
		if ($imagePath && file_exists(public_path($imagePath))) {
			unlink(public_path($imagePath));
		}

		return back()->with('success', "Combo {$combo->name} eliminado exitosamente.");
	}

	public function get(Request $request)
	{
		return response()->json(Combo::all());
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

		$combo = Combo::where('id', $id)
			->where('restaurant_id', $restaurantId)
			->firstOrFail();

		$prev_image = $combo->image_url;

		if ($request->hasFile('image_url')) {
			$image = $request->file('image_url');
			$path = $image->store('combos', 'public');
			$combo->image_url = '/storage/' . $path;
		} else {
			$combo->image_url = null;
		}

		// Eliminar imagen anterior
		if ($prev_image && file_exists(public_path($prev_image))) {
			unlink(public_path($prev_image));
		}

		$combo->save();

		return back()->with('success', 'Combo actualizado exitosamente.');
	}
}
