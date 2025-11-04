<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\DishController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderTrackingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\TopRestaurant;
use App\Http\Controllers\RestaurantExploreController;
use App\Http\Controllers\RestaurantDashboardController;

Route::get('/', function () {
	$topRestaurants = TopRestaurant::all()->map(function ($r) {
		// Normalizar logo_url a URL pública servible
		if (!empty($r->logo_url)) {
			// Si ya viene con /storage o http, dejar tal cual; si viene relativo, convertir a /storage/...
			if (!str_starts_with($r->logo_url, '/storage') && !str_starts_with($r->logo_url, 'http')) {
				$r->logo_url = Storage::url($r->logo_url); // /storage/...
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

Route::get('/about', fn () => Inertia::render('about'))->name('about');

Route::get('/contact', fn () => Inertia::render('contact'))->name('contact');

Route::middleware(['auth', 'verified'])->group(function () {
	Route::get('dashboard', function () {
		return  Inertia::render('dashboard');
	})->name('dashboard');
	//Route::resource('/customer', CustomerController::class)->names('customer');
	//Route::resource('/restaurant', RestaurantController::class)->names('restaurant');

	Route::get('checkout', [CheckoutController::class, 'summary'])->name('checkout');
	Route::get('checkout/payment', [CheckoutController::class, 'payment'])->name('checkout.payment');
	Route::post('checkout/payment', [CheckoutController::class, 'placeOrder'])->name('checkout.payment.store');
	Route::get('checkout/confirmation', [CheckoutController::class, 'confirmation'])->name('checkout.confirmation');

	Route::get('orders', [OrderTrackingController::class, 'index'])->name('orders.index');
	Route::get('orders/{order}/track', [OrderTrackingController::class, 'show'])->name('orders.track');
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

Route::prefix('cart')->group(function () {
	Route::get('/', [CartController::class, 'index'])->name('cart.index');
	Route::match(['post', 'put'], 'add', [CartController::class, 'store'])->name('cart.add');
	Route::delete('/', [CartController::class, 'destroy'])->name('cart.destroy');
	Route::post('/clear', [CartController::class, 'destroy'])->name('cart.clear');
});

Route::get('/restaurants', [RestaurantExploreController::class, 'index'])
	->name('restaurants.explore');
Route::get('/restaurants/{restaurant}', [RestaurantController::class, 'show'])
    ->name('restaurants.show');

	Route::middleware(['auth'])->get('/restaurants/dashboard', [RestaurantDashboardController::class, 'index']);