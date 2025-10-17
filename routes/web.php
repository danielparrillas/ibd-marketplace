<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
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
Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
	->name('password.request');

Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
	->name('password.email');

Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
	->name('password.reset');

Route::post('reset-password', [NewPasswordController::class, 'store'])
	->name('password.store');

Route::resource('/ingredients', IngredientController::class)->names('ingredients');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
