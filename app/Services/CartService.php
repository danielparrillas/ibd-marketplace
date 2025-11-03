<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Dish;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

class CartService
{
    public function __construct(private readonly DatabaseManager $database)
    {
    }

    public function resolveOwnerFromRequest(Request $request): array
    {
        $userId = $request->user()?->id;
        $sessionToken = $request->cookie('cart_token') ?? $request->input('session_token');

        if (!$userId && !$sessionToken) {
            throw new UnprocessableEntityHttpException('Cart owner could not be resolved.');
        }

        return [
            'user_id' => $userId,
            'session_token' => $userId ? null : $sessionToken,
        ];
    }

    public function tryResolveOwnerFromRequest(Request $request): ?array
    {
        try {
            return $this->resolveOwnerFromRequest($request);
        } catch (UnprocessableEntityHttpException) {
            return null;
        }
    }

    public function getItems(?int $userId, ?string $sessionToken): Collection
    {
        return CartItem::query()
            ->with(['dish.restaurant', 'restaurant'])
            ->forOwner($userId, $sessionToken)
            ->orderBy('created_at')
            ->get();
    }

    public function addOrUpdateItem(Dish $dish, int $quantity, array $owner, ?array $options = null): CartItem
    {
        if ($quantity < 0) {
            throw new UnprocessableEntityHttpException('Quantity must be zero or greater.');
        }

        $this->assertSingleRestaurantConstraint($dish->restaurant_id, $owner);

        $attributes = [
            'dish_id' => $dish->id,
            'restaurant_id' => $dish->restaurant_id,
        ] + Arr::only($owner, ['user_id', 'session_token']);

        return $this->database->connection()->transaction(function () use ($attributes, $quantity, $options) {
            $cartItem = CartItem::query()->lockForUpdate()->firstOrNew($attributes);

            if ($quantity === 0) {
                if ($cartItem->exists) {
                    $cartItem->delete();
                }

                return $cartItem;
            }

            $cartItem->quantity = $quantity;
            if ($options !== null) {
                $cartItem->options = $options;
            } elseif (!$cartItem->exists || $cartItem->options === null) {
                $cartItem->options = [];
            }
            $cartItem->save();

            return $cartItem;
        });
    }

    public function clearOwner(array $owner): void
    {
        CartItem::query()->forOwner($owner['user_id'] ?? null, $owner['session_token'] ?? null)->delete();
    }

    public function migrateSessionCartToUser(string $sessionToken, int $userId): void
    {
        if ($sessionToken === '') {
            return;
        }

        DB::transaction(function () use ($sessionToken, $userId) {
            $guestItems = CartItem::query()
                ->where('session_token', $sessionToken)
                ->get();

            if ($guestItems->isEmpty()) {
                return;
            }

            foreach ($guestItems as $guestItem) {
                $existing = CartItem::query()
                    ->where('user_id', $userId)
                    ->where('dish_id', $guestItem->dish_id)
                    ->first();

                $guestRestaurantId = $guestItem->restaurant_id;

                if ($existing && $existing->restaurant_id !== $guestRestaurantId) {
                    $existing->delete();
                }

                $conflictingForUser = CartItem::query()
                    ->where('user_id', $userId)
                    ->where('restaurant_id', '!=', $guestRestaurantId)
                    ->get();

                if ($conflictingForUser->isNotEmpty()) {
                    foreach ($conflictingForUser as $conflict) {
                        $conflict->session_token = $sessionToken;
                        $conflict->user_id = null;
                        $conflict->save();
                    }
                }

                if ($existing) {
                    $existing->quantity += $guestItem->quantity;
                    $existing->options = $guestItem->options ?? [];
                    $existing->save();
                    $guestItem->delete();
                    continue;
                }

                $guestItem->user_id = $userId;
                $guestItem->session_token = null;
                $guestItem->save();
            }
        });
    }

    private function assertSingleRestaurantConstraint(int $newRestaurantId, array $owner): void
    {
        $existingRestaurantId = CartItem::query()
            ->forOwner($owner['user_id'] ?? null, $owner['session_token'] ?? null)
            ->value('restaurant_id');

        if ($existingRestaurantId && $existingRestaurantId !== $newRestaurantId) {
            throw new ConflictHttpException('Solo puedes añadir platos de un mismo restaurante.');
        }
    }

    public function transformCollection(Collection $items): array
    {
        return $items->map(function (CartItem $item) {
            return [
                'id' => $item->id,
                'dish' => [
                    'id' => $item->dish->id,
                    'name' => $item->dish->name,
                    'description' => $item->dish->description,
                    'price' => (float) $item->dish->price,
                    'category' => $item->dish->category,
                    'image_url' => $item->dish->image_url,
                    'preparation_time' => $item->dish->preparation_time,
                    'calories' => $item->dish->calories,
                    'allergens' => $item->dish->allergens,
                ],
                'restaurant' => [
                    'id' => $item->restaurant->id,
                    'business_name' => $item->restaurant->business_name,
                ],
                'quantity' => $item->quantity,
                'options' => $item->options ?? [],
            ];
        })->all();
    }
}
