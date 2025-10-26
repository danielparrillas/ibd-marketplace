<?php
use App\Http\Controllers\CustomerProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AddressController;


Route::middleware('auth')->group(
	function () {
    Route::get('/customer/profile', [CustomerProfileController::class, 'edit'])->name('customer.profile.edit');
    Route::put('/customer/profile', [CustomerProfileController::class, 'update'])->name('customer.profile.update');
    Route::resource('/addresses', AddressController::class)->except(['create', 'show', 'edit']);
    Route::delete('/addresses/{address}', [AddressController::class, 'destroy'])
    ->name('addresses.destroy');
	}
);
