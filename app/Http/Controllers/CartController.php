<?php

namespace App\Http\Controllers;

use App\Models\Dish;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(private readonly CartService $cartService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $owner = $this->cartService->tryResolveOwnerFromRequest($request);

        if (!$owner) {
            return response()->json([
                'data' => [],
            ]);
        }

        $items = $this->cartService->getItems($owner['user_id'], $owner['session_token']);

        return response()->json([
            'data' => $this->cartService->transformCollection($items),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'dish_id' => ['required', 'integer', 'exists:dishes,id'],
            'quantity' => ['required', 'integer', 'min:0'],
            'options' => ['nullable', 'array'],
            'session_token' => ['nullable', 'string'],
        ]);

        $owner = $this->cartService->resolveOwnerFromRequest($request);
        $dish = Dish::query()->with('restaurant')->findOrFail($validated['dish_id']);

        $this->cartService->addOrUpdateItem(
            $dish,
            $validated['quantity'],
            $owner,
            $validated['options'] ?? null,
        );

        $items = $this->cartService->getItems($owner['user_id'], $owner['session_token']);

        return response()->json([
            'data' => $this->cartService->transformCollection($items),
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $owner = $this->cartService->tryResolveOwnerFromRequest($request);

        if (!$owner) {
            return response()->json(['data' => []]);
        }

        $this->cartService->clearOwner($owner);

        return response()->json(['data' => []]);
    }
}
