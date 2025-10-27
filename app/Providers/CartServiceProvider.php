<?php

namespace App\Providers;

use App\Events\OrderCreated;
use App\Services\CartService;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class CartServiceProvider extends ServiceProvider
{
    public function boot(CartService $cartService): void
    {
        $migrateCart = function ($event) use ($cartService): void {
            $request = request();

            if (!$request) {
                return;
            }

            $sessionToken = $request->cookie('cart_token');
            $userId = $event->user?->id;

            if (!$sessionToken || !$userId) {
                return;
            }

            $cartService->migrateSessionCartToUser($sessionToken, $userId);
            Cookie::queue(Cookie::forget('cart_token'));
        };

        Event::listen(Login::class, $migrateCart);
        Event::listen(Registered::class, $migrateCart);

        Event::listen(OrderCreated::class, function (OrderCreated $event) use ($cartService): void {
            $owner = $event->owner();

            if (empty($owner['user_id']) && empty($owner['session_token'])) {
                return;
            }

            $cartService->clearOwner($owner);
        });
    }
}
