<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\DishController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\TopRestaurant;
use App\Http\Controllers\RestaurantExploreController;

Route::get('/', function () {
	$topRestaurants = TopRestaurant::all()->map(function ($r) {
		// Normalizar logo_url a URL pública servible
		if (!empty($r->logo_url)) {
			// Si ya viene con /storage o http, dejar tal cual; si viene relativo, convertir a /storage/...
			if (!str_starts_with($r->logo_url, '/storage') && !str_starts_with($r->logo_url, 'http')) {
				$r->logo_url = Storage::disk('public')->url($r->logo_url); // /storage/...
			}
		}
		return $r;
	});

	// Cargar métricas de "Nuestro Éxito"
	$ourSuccess = DB::table('our_successes')
		->select('count_restautants', 'count_customers', 'count_orders')
		->first();

	return Inertia::render('welcome', [
		'featuredRestaurants' => $topRestaurants,
		'ourSuccess' => $ourSuccess,
	]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
	Route::get('dashboard', function () {
		return  Inertia::render('dashboard');
	})->name('dashboard');
	//Route::resource('/customer', CustomerController::class)->names('customer');
	//Route::resource('/restaurant', RestaurantController::class)->names('restaurant');
});
Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
	->name('password.request');

Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
	->name('password.email');

Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
	->name('password.reset');

Route::post('reset-password', [NewPasswordController::class, 'store'])
	->name('password.store');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/restaurant.php';
require __DIR__.'/customer.php';

Route::get('/restaurants', [RestaurantExploreController::class, 'index'])
	->name('restaurants.explore');