<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\RestaurantController;
use App\Models\Customer;
use App\Models\Restaurant;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
	return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
	Route::get('dashboard', function () {
		return  Inertia::render('dashboard');
	})->name('dashboard');
	Route::resource('/customer', CustomerController::class)->names('customer');
	Route::resource('/restaurant', RestaurantController::class)->names('restaurant');
});

Route::prefix('admin')->middleware(['auth', 'verified'])->group(function () {
	Route::resource('/ingredient', IngredientController::class)->names('ingredient');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
