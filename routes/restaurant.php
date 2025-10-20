<?php

use App\Http\Controllers\IngredientController;
use App\Http\Controllers\DishController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(
	function () {
		Route::resource('/ingredients', IngredientController::class)->names('ingredients');

		Route::resource('/dishes', DishController::class)->names('dishes');
		Route::post('/dishes/{id}/image', [DishController::class, 'uploadImage'])->name('dishes.image.upload');
	}
);
