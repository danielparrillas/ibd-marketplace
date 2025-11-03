<?php

namespace Database\Seeders\examples;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Restaurant;
use App\Models\Ingredient;
use App\Models\Dish;
use App\Models\DishIngredient;
use App\Models\Combo;
use App\Models\ComboDish;
use Illuminate\Support\Facades\DB;

class RestaurantBurguerExampleSeeder extends Seeder
{
	public function run(): void
	{
		try {
			DB::beginTransaction();
			// Crear usuario propietario del restaurante
			$user = User::create([
				'name' => 'Carlos Burguer',
				'email' => 'carlos@burgertown.com',
				'password' => bcrypt('password123'),
				'user_type' => 'restaurant',
			]);

			// Crear restaurante
			$restaurant = Restaurant::create([
				'user_id' => $user->id,
				'business_name' => 'BurgerTown',
				'legal_name' => 'BurgerTown S.A. de C.V.',
				'phone' => '2284-5566',
				'legal_document' => 'DOC-12345',
				'business_license' => 'LIC-67890',
				'description' => 'Restaurante especializado en hamburguesas artesanales y batidos.',
				'logo_url' => 'https://example.com/images/burgertown_logo.png',
				'responsible_name' => 'Carlos Burguer',
			]);

			// Crear ingredientes
			$ingredients = [
				['name' => 'Pan brioche', 'unit_measure' => 'unidad', 'current_stock' => 200, 'min_stock_alert' => 50, 'unit_cost' => 0.35, 'supplier' => 'Panadería El Trigo', 'expiration_date' => now()->addDays(10)],
				['name' => 'Carne de res 100g', 'unit_measure' => 'unidad', 'current_stock' => 150, 'min_stock_alert' => 30, 'unit_cost' => 1.10, 'supplier' => 'Carnes Selectas', 'expiration_date' => now()->addDays(5)],
				['name' => 'Queso cheddar', 'unit_measure' => 'rebanada', 'current_stock' => 300, 'min_stock_alert' => 80, 'unit_cost' => 0.20, 'supplier' => 'Lácteos del Valle', 'expiration_date' => now()->addDays(15)],
				['name' => 'Lechuga', 'unit_measure' => 'hoja', 'current_stock' => 500, 'min_stock_alert' => 100, 'unit_cost' => 0.05, 'supplier' => 'Huerto Verde', 'expiration_date' => now()->addDays(3)],
				['name' => 'Tomate', 'unit_measure' => 'rodaja', 'current_stock' => 400, 'min_stock_alert' => 80, 'unit_cost' => 0.07, 'supplier' => 'Huerto Verde', 'expiration_date' => now()->addDays(4)],
				['name' => 'Papas fritas', 'unit_measure' => 'porción', 'current_stock' => 250, 'min_stock_alert' => 60, 'unit_cost' => 0.50, 'supplier' => 'FritoSal', 'expiration_date' => now()->addDays(20)],
			];

			foreach ($ingredients as &$ingredient) {
				$ingredient['restaurant_id'] = $restaurant->id;
			}
			$ingredients = Ingredient::insert($ingredients);

			// Crear platillos (hamburguesas)
			$classic = Dish::create([
				'restaurant_id' => $restaurant->id,
				'name' => 'Hamburguesa Clásica',
				'description' => 'Jugosa carne de res, queso cheddar, tomate, lechuga y pan brioche.',
				'price' => 4.50,
				'category' => 'Hamburguesa',
				'image_url' => 'https://example.com/images/classic_burger.jpg',
				'preparation_time' => 10,
				'is_available' => true,
				'is_featured' => true,
				'calories' => 600,
				'allergens' => 'gluten,lácteos',
			]);

			$cheese = Dish::create([
				'restaurant_id' => $restaurant->id,
				'name' => 'Cheeseburger Doble',
				'description' => 'Doble carne de res con extra queso cheddar y pan brioche.',
				'price' => 5.75,
				'category' => 'Hamburguesa',
				'image_url' => 'https://example.com/images/double_cheese.jpg',
				'preparation_time' => 12,
				'is_available' => true,
				'is_featured' => false,
				'calories' => 850,
				'allergens' => 'gluten,lácteos',
			]);

			// Asociar ingredientes a los platillos
			$classicIngredients = [
				['dish_id' => $classic->id, 'ingredient_id' => 1, 'quantity_needed' => 1],
				['dish_id' => $classic->id, 'ingredient_id' => 2, 'quantity_needed' => 1],
				['dish_id' => $classic->id, 'ingredient_id' => 3, 'quantity_needed' => 1],
				['dish_id' => $classic->id, 'ingredient_id' => 4, 'quantity_needed' => 2],
				['dish_id' => $classic->id, 'ingredient_id' => 5, 'quantity_needed' => 2],
			];
			DishIngredient::insert($classicIngredients);

			$cheeseIngredients = [
				['dish_id' => $cheese->id, 'ingredient_id' => 1, 'quantity_needed' => 1],
				['dish_id' => $cheese->id, 'ingredient_id' => 2, 'quantity_needed' => 2],
				['dish_id' => $cheese->id, 'ingredient_id' => 3, 'quantity_needed' => 2],
			];
			DishIngredient::insert($cheeseIngredients);

			// Crear combo
			$combo = Combo::create([
				'restaurant_id' => $restaurant->id,
				'name' => 'Combo Clásico',
				'description' => 'Hamburguesa clásica + papas fritas + bebida pequeña.',
				'combo_price' => 6.25,
				'image_url' => 'https://example.com/images/combo_classic.jpg',
				'is_available' => true,
				'valid_from' => now()->subDay(),
				'valid_until' => now()->addMonth(),
			]);

			// Asociar platillos al combo
			ComboDish::create([
				'combo_id' => $combo->id,
				'dish_id' => $classic->id,
				'quantity' => 1,
			]);

			DB::commit();
		} catch (\Exception $e) {
			DB::rollBack();
			throw $e;
		}
	}
}
