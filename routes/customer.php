<?php
use App\Http\Controllers\CustomerProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware('auth')->group(
	function () {
    Route::get('/customer/profile', [CustomerProfileController::class, 'edit'])->name('customer.profile.edit');
    Route::put('/customer/profile', [CustomerProfileController::class, 'update'])->name('customer.profile.update');
	}
);
