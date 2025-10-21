<?php

use App\Http\Controllers\IngredientController;
use App\Http\Controllers\DishController;
use App\Http\Controllers\DishIngredientController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\RestaurantProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(
	function () {
		Route::resource('/ingredients', IngredientController::class)->names('ingredients');

		Route::resource('/dishes', DishController::class)->names('dishes');
		Route::post('/dishes/{id}/image', [DishController::class, 'uploadImage'])->name('dishes.image.upload');

		Route::resource('/dishes/{dishId}/ingredients', DishIngredientController::class)->names('dishes.ingredients');
		//Route::resource('/restaurant', RestaurantProfileController::class)->names('restaurant');
		Route::get('/restaurant/profile', [RestaurantProfileController::class, 'edit'])->name('restaurant.profile.edit');
    	Route::put('/restaurant/profile', [RestaurantProfileController::class, 'update'])->name('restaurant.profile.update');
	}
);
/* Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/restaurant/profile', [RestaurantProfileController::class, 'edit'])->name('restaurant.profile.edit');
    Route::put('/restaurant/profile', [RestaurantProfileController::class, 'update'])->name('restaurant.profile.update');
});  */