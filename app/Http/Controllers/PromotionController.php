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
			'is_active'         => ['sometimes'],
			'usage_limit'       => ['nullable', 'integer', 'min:1'],
		]);

		$data['is_active'] = $request->has('is_active') ? true : false;

		// Reglas condicionales manuales
		if (($data['applies_to'] ?? null) === 'category' && empty($data['target_categories'])) {
			return back()->withErrors([
				'target_categories' => 'Se requiere al menos una categoría cuando applies_to es category.',
			])->withInput();
		}
		if (($data['applies_to'] ?? null) === 'specificdishes' && empty($data['target_dish_ids'])) {
			return back()->withErrors([
				'target_dish_ids' => 'Se requiere al menos un plato cuando applies_to es specificdishes.',
			])->withInput();
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

	public function update(Request $request, Promotion $promotion)
	{
		// Verificar que la promoción pertenece al restaurante del usuario autenticado
		$userId = Auth::id();
		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if ($promotion->restaurant_id != $restaurantId) {
			return back()->with('warning', 'No autorizado para actualizar esta promoción.');
		}

		$data = $request->validate([
			'name'              => ['sometimes', 'string', 'max:255'],
			'description'       => ['nullable', 'string'],
			'promotion_type'    => ['sometimes', 'in:percentage,fixedamount,buyxgety'],
			'discount_value'    => ['sometimes', 'numeric', 'min:0'],
			'min_order_amount'  => ['nullable', 'numeric', 'min:0'],
			'max_discount'      => ['nullable', 'numeric', 'min:0'],
			'applies_to'        => ['sometimes', 'in:all,category,specificdishes'],
			// Si applies_to = category, requerimos categorías (array de strings)
			'target_categories'      => ['nullable', 'array'],
			'target_categories.*'    => ['string', 'max:100'],
			// Si applies_to = specificdishes, requerimos ids de platos (array de enteros existentes)
			'target_dish_ids'        => ['nullable', 'array'],
			'target_dish_ids.*'      => ['integer', 'exists:dishes,id'],
			'valid_from'        => ['sometimes', 'date'],
			'valid_until'       => ['sometimes', 'date', 'after_or_equal:valid_from'],
			'is_active'         => ['sometimes'],
			'usage_limit'       => ['nullable', 'integer', 'min:1'],
		]);

		// Obtener applies_to (puede venir del request o usar el actual)
		$appliesTo = $data['applies_to'] ?? $promotion->applies_to;

		// Reglas condicionales manuales
		if ($appliesTo === 'category') {
			// Si se está enviando target_categories o applies_to cambió a category
			if (isset($data['target_categories']) && empty($data['target_categories'])) {
				return back()->withErrors([
					'target_categories' => 'Se requiere al menos una categoría cuando applies_to es category.',
				])->withInput();
			}
			// Si applies_to cambió a category pero no se envían categorías
			if (isset($data['applies_to']) && $data['applies_to'] === 'category' && !isset($data['target_categories'])) {
				return back()->withErrors([
					'target_categories' => 'Se requiere al menos una categoría cuando applies_to es category.',
				])->withInput();
			}
			// Si applies_to cambió a category pero no se envían categorías
			if (isset($data['applies_to']) && $data['applies_to'] === 'category' && !isset($data['target_categories'])) {
				return back()->withErrors([
					'target_categories' => 'Se requiere al menos una categoría cuando applies_to es category.',
				])->withInput();
			}
		}

		if ($appliesTo === 'specificdishes') {
			// Si se está enviando target_dish_ids o applies_to cambió a specificdishes
			if (isset($data['target_dish_ids']) && empty($data['target_dish_ids'])) {
				return back()->withErrors([
					'target_dish_ids' => 'Se requiere al menos un plato cuando applies_to es specificdishes.',
				])->withInput();
			}
		}

		if ($appliesTo === 'specificdishes') {
			// Si se está enviando target_dish_ids o applies_to cambió a specificdishes
			if (isset($data['target_dish_ids']) && empty($data['target_dish_ids'])) {
				return back()->withErrors([
					'target_dish_ids' => 'Se requiere al menos un plato cuando applies_to es specificdishes.',
				])->withInput();
			}
			// Si applies_to cambió a specificdishes pero no se envían dish_ids
			if (isset($data['applies_to']) && $data['applies_to'] === 'specificdishes' && !isset($data['target_dish_ids'])) {
				return back()->withErrors([
					'target_dish_ids' => 'Se requiere al menos un plato cuando applies_to es specificdishes.',
				])->withInput();
			}
		}

		// Transformar arrays a cadenas separadas por comas
		if (isset($data['target_categories']) && is_array($data['target_categories'])) {
			$categories = array_values(array_filter(array_map('trim', $data['target_categories']), fn($v) => $v !== ''));
			$data['target_categories'] = !empty($categories) ? implode(',', $categories) : null;
		}
		if (isset($data['target_dish_ids']) && is_array($data['target_dish_ids'])) {
			$ids = array_values(array_filter(array_map(fn($v) => is_numeric($v) ? (int) $v : null, $data['target_dish_ids']), fn($v) => $v !== null));
			$data['target_dish_ids'] = !empty($ids) ? implode(',', $ids) : null;
		}

		// Transformar arrays a cadenas separadas por comas
		if (isset($data['target_categories']) && is_array($data['target_categories'])) {
			$categories = array_values(array_filter(array_map('trim', $data['target_categories']), fn($v) => $v !== ''));
			$data['target_categories'] = !empty($categories) ? implode(',', $categories) : null;
		}
		if (isset($data['target_dish_ids']) && is_array($data['target_dish_ids'])) {
			$ids = array_values(array_filter(array_map(fn($v) => is_numeric($v) ? (int) $v : null, $data['target_dish_ids']), fn($v) => $v !== null));
			$data['target_dish_ids'] = !empty($ids) ? implode(',', $ids) : null;
		}

		// Limpiar campos que no corresponden según applies_to
		if (isset($data['applies_to'])) {
			if ($data['applies_to'] === 'all') {
				$data['target_categories'] = null;
				$data['target_dish_ids'] = null;
			} elseif ($data['applies_to'] === 'category') {
				$data['target_dish_ids'] = null;
			} elseif ($data['applies_to'] === 'specificdishes') {
				$data['target_categories'] = null;
			}
		}

		$promotion->update($data);

		return back()->with('success', 'Promoción actualizada exitosamente.');
	}

	public function destroy(Promotion $promotion)
	{
		// Verificar que la promoción pertenece al restaurante del usuario autenticado
		$userId = Auth::id();
		$restaurantId = Restaurant::where('user_id', $userId)->value('id');

		if ($promotion->restaurant_id != $restaurantId) {
			return back()->with('warning', 'No autorizado para eliminar esta promoción.');
		}

		// Validar que la promoción no haya sido utilizada
		if ($promotion->usage_count > 0) {
			return back()->with('warning', 'No se puede eliminar la promoción "' . $promotion->name . '" porque ya ha sido utilizada ' . $promotion->usage_count . ' vez(veces).');
		}

		$promotionName = $promotion->name;
		$promotion->delete();

		return back()->with('success', 'Promoción "' . $promotionName . '" eliminada exitosamente.');
	}
}
