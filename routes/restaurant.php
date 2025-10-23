<?php

use App\Http\Controllers\IngredientController;
use App\Http\Controllers\DishController;
use App\Http\Controllers\DishIngredientController;
use App\Http\Controllers\ComboController;
use App\Http\Controllers\ComboDishController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\RestaurantProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(
	function () {
		Route::resource('/ingredients', IngredientController::class)->names('ingredients');

		Route::resource('/dishes', DishController::class)->names('dishes');
		Route::post('/dishes/{id}/image', [DishController::class, 'uploadImage'])->name('dishes.image.upload');

		Route::resource('/combos', ComboController::class)->names('combos');
		Route::post('/combos/{id}/image', [ComboController::class, 'uploadImage'])->name('combos.image.upload');

		Route::resource('/combos/{comboId}/dishes', ComboDishController::class)->names('combos.dishes');

		Route::resource('/dishes/{dishId}/ingredients', DishIngredientController::class)->names('dishes.ingredients');
		//Route::resource('/restaurant', RestaurantProfileController::class)->names('restaurant');
		Route::get('/restaurant/profile', [RestaurantProfileController::class, 'edit'])->name('restaurant.profile.edit');
		Route::put('/restaurant/profile', [RestaurantProfileController::class, 'update'])->name('restaurant.profile.update');

		// Página de índice de promociones (Inertia), consume el endpoint JSON /promotions
		Route::resource('/promotions', PromotionController::class)->names('promotions');
	}
);
/* Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/restaurant/profile', [RestaurantProfileController::class, 'edit'])->name('restaurant.profile.edit');
    Route::put('/restaurant/profile', [RestaurantProfileController::class, 'update'])->name('restaurant.profile.update');
});  */