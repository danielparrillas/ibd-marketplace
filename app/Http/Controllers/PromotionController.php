<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use App\Models\Restaurant;
use App\Models\Dish;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class PromotionController extends Controller
{
	public function index(Request $request)
	{
		$userId = Auth::id();
		$restaurantId = Restaurant::where('user_id', $userId)->value('id');
		$restaurant = Restaurant::where('user_id', $userId)->first();
		$promotions = Promotion::where('restaurant_id', $restaurantId)->get();
		$dishes = Dish::where('restaurant_id', $restaurantId)->get();

		$success = session('success');
		$warning = session('warning');

		return inertia('promotions/promotions', [
			'promotions' => $promotions,
			'restaurant' => $restaurant,
			'dishes' => $dishes,
			'success' => $success,
			'warning' => $warning,
		]);
	}

	function store(Request $request)
	{
		$data = $request->validate([
			'restaurant_id'     => ['required', 'integer', 'exists:restaurants,id'],
			'name'              => ['required', 'string', 'max:255'],
			'description'       => ['nullable', 'string'],
			'promotion_type'    => ['required', 'in:percentage,fixedamount,buyxgety'],
			'discount_value'    => ['required', 'numeric', 'min:0'],
			'min_order_amount'  => ['nullable', 'numeric', 'min:0'],
			'max_discount'      => ['nullable', 'numeric', 'min:0'],
			'applies_to'        => ['required', 'in:all,category,specificdishes'],
			// Si applies_to = category, requerimos categorías (array de strings)
			'target_categories'      => ['nullable', 'array'],
			'target_categories.*'    => ['string', 'max:100'],
			// Si applies_to = specificdishes, requerimos ids de platos (array de enteros existentes)
			'target_dish_ids'        => ['nullable', 'array'],
			'target_dish_ids.*'      => ['integer', 'exists:dishes,id'],
			'valid_from'        => ['required', 'date'],
			'valid_until'       => ['required', 'date', 'after_or_equal:valid_from'],
			'is_active'         => ['sometimes', 'boolean'],
			'usage_limit'       => ['nullable', 'integer', 'min:1'],
		]);

		// Reglas condicionales manuales
		if (($data['applies_to'] ?? null) === 'category' && empty($data['target_categories'])) {
			return response()->json([
				'message' => 'Validation error',
				'errors' => [
					'target_categories' => ['Se requiere al menos una categoría cuando applies_to es category.'],
				],
			], 422);
		}
		if (($data['applies_to'] ?? null) === 'specificdishes' && empty($data['target_dish_ids'])) {
			return response()->json([
				'message' => 'Validation error',
				'errors' => [
					'target_dish_ids' => ['Se requiere al menos un plato cuando applies_to es specificdishes.'],
				],
			], 422);
		}

		// Transformar arrays a cadenas separadas por comas, según el modelo/capa de datos
		if (isset($data['target_categories']) && is_array($data['target_categories'])) {
			$categories = array_values(array_filter(array_map('trim', $data['target_categories']), fn($v) => $v !== ''));
			$data['target_categories'] = implode(',', $categories);
		}
		if (isset($data['target_dish_ids']) && is_array($data['target_dish_ids'])) {
			$ids = array_values(array_filter(array_map(fn($v) => is_numeric($v) ? (int) $v : null, $data['target_dish_ids']), fn($v) => $v !== null));
			$data['target_dish_ids'] = implode(',', $ids);
		}

		// Aseguramos que usage_count inicie en 0 independientemente de lo que envíe el cliente
		$data['usage_count'] = 0;

		$promotion = Promotion::create($data);

		return back()->with('success', 'Promoción creada exitosamente.');
	}
}
