<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OrderTrackingController extends Controller
{
    private const STATUS_RANK = [
        'pending' => 0,
        'confirmed' => 1,
        'prepared' => 2,
        'outfordelivery' => 3,
        'completed' => 4,
        'cancelled' => -1,
    ];

    private const STATUS_LABELS = [
        'pending' => 'Pendiente',
        'confirmed' => 'Aceptado',
        'prepared' => 'Listo',
        'outfordelivery' => 'En camino',
        'completed' => 'Entregado',
        'cancelled' => 'Cancelado',
    ];

    public function index(Request $request): Response
    {
        $user = $request->user();

        if (!$user) {
            abort(403);
        }

        $ordersQuery = Order::query()->with([
            'restaurant:id,business_name,logo_url,user_id',
            'deliveryAddress:id,address_line_1',
            'customer:id,user_id',
        ]);

        $userType = $user->user_type ? strtolower($user->user_type) : null;
        $customerId = $user->customer?->id;
        $restaurantId = $user->restaurant?->id;

        if ($userType !== 'admin') {
            $ordersQuery->where(function ($query) use ($customerId, $restaurantId) {
                if ($customerId) {
                    $query->orWhere('customer_id', $customerId);
                }

                if ($restaurantId) {
                    $query->orWhere('restaurant_id', $restaurantId);
                }
            });

            if (!$customerId && !$restaurantId) {
                $ordersQuery->whereRaw('0 = 1');
            }
        }

        $orders = $ordersQuery
            ->orderByDesc('created_at')
            ->take(25)
            ->get();

        $ordersData = $orders->map(function (Order $order) {
            return [
                'id' => $order->id,
                'number' => $order->order_number,
                'status' => $order->status,
                'status_label' => $this->statusLabel($order->status),
                'created_at' => optional($order->created_at)->toIso8601String(),
                'total_amount' => (float) $order->total_amount,
                'restaurant' => $order->restaurant ? [
                    'id' => $order->restaurant->id,
                    'name' => $order->restaurant->business_name,
                    'logo_url' => $this->formatMediaPath($order->restaurant->logo_url),
                ] : null,
                'delivery_summary' => $order->deliveryAddress?->address_line_1,
            ];
        });

        return Inertia::render('orders/index', [
            'orders' => $ordersData,
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        $order->load([
            'items.dish:id,name,image_url',
            'items.combo:id,name',
            'restaurant:id,business_name,logo_url,user_id,phone',
            'deliveryAddress:id,address_line_1,address_line_2,latitude,longitude,delivery_instructions',
            'customer:id,user_id',
            'customer.user:id,name,email',
        ]);

        $user = $request->user();

        if ($user) {
            $userType = $user->user_type ? strtolower($user->user_type) : null;
            $customerId = $user->customer?->id;
            $restaurantId = $user->restaurant?->id;

            $allowed = false;

            if ($userType === 'admin') {
                $allowed = true;
            }

            if ($customerId && (int) $order->customer_id === (int) $customerId) {
                $allowed = true;
            }

            if ($restaurantId && (int) $order->restaurant_id === (int) $restaurantId) {
                $allowed = true;
            }

            if (!$allowed) {
                abort(403);
            }
        }

        $timeline = $this->buildTimeline($order);

        $items = $order->items->map(function ($item) {
            $name = $item->item_type === 'combo'
                ? ($item->combo->name ?? 'Combo')
                : ($item->dish->name ?? 'Producto');

            return [
                'id' => $item->id,
                'name' => $name,
                'quantity' => $item->quantity,
                'unit_price' => (float) $item->unit_price,
                'total_price' => (float) $item->total_price,
                'image_url' => $item->dish?->image_url ? $this->formatMediaPath($item->dish->image_url) : null,
                'type' => $item->item_type,
            ];
        });

        $address = $order->deliveryAddress ? [
            'line_1' => $order->deliveryAddress->address_line_1,
            'line_2' => $order->deliveryAddress->address_line_2,
            'instructions' => $order->deliveryAddress->delivery_instructions,
            'latitude' => $order->deliveryAddress->latitude,
            'longitude' => $order->deliveryAddress->longitude,
            'map_url' => $this->buildMapUrl($order->deliveryAddress->latitude, $order->deliveryAddress->longitude),
        ] : null;

        $restaurant = $order->restaurant ? [
            'id' => $order->restaurant->id,
            'name' => $order->restaurant->business_name,
            'phone' => $order->restaurant->phone,
            'logo_url' => $this->formatMediaPath($order->restaurant->logo_url),
        ] : null;

        $etaMinutes = null;
        if ($order->estimated_delivery_time) {
            $diff = now()->diffInMinutes($order->estimated_delivery_time, false);
            $etaMinutes = $diff > 0 ? $diff : null;
        }

        return Inertia::render('orders/tracking', [
            'order' => [
                'id' => $order->id,
                'number' => $order->order_number,
                'status' => $order->status,
                'status_label' => $this->statusLabel($order->status),
                'subtotal' => (float) $order->subtotal,
                'tax_amount' => (float) $order->tax_amount,
                'delivery_fee' => (float) $order->delivery_fee,
                'discount_amount' => (float) $order->discount_amount,
                'total_amount' => (float) $order->total_amount,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'payment_reference' => $order->payment_reference,
                'special_instructions' => $order->special_instructions,
                'estimated_delivery_time' => optional($order->estimated_delivery_time)->toIso8601String(),
                'actual_delivery_time' => optional($order->actual_delivery_time)->toIso8601String(),
                'created_at' => optional($order->created_at)->toIso8601String(),
            ],
            'restaurant' => $restaurant,
            'address' => $address,
            'items' => $items,
            'timeline' => $timeline,
            'eta_minutes' => $etaMinutes,
            'customer' => $order->customer?->user ? [
                'name' => $order->customer->user->name,
                'email' => $order->customer->user->email,
            ] : null,
            'courier' => null,
        ]);
    }

    private function buildTimeline(Order $order): array
    {
        $status = $order->status ?? 'pending';
        $rank = self::STATUS_RANK[$status] ?? -1;
        $isCancelled = $status === 'cancelled';

        $stepsConfig = [
            [
                'key' => 'order_received',
                'title' => 'Orden recibida',
                'description' => 'El restaurante aceptó tu pedido.',
                'complete_rank' => self::STATUS_RANK['confirmed'],
                'timestamp' => optional($order->created_at)->toIso8601String(),
            ],
            [
                'key' => 'preparing',
                'title' => 'En cocina / Preparando',
                'description' => 'El equipo está preparando tus platos.',
                'complete_rank' => self::STATUS_RANK['prepared'],
            ],
            [
                'key' => 'ready',
                'title' => 'Empaquetado y listo',
                'description' => 'El pedido está listo para el repartidor.',
                'complete_rank' => self::STATUS_RANK['outfordelivery'],
            ],
            [
                'key' => 'driver_assigned',
                'title' => 'Repartidor asignado',
                'description' => 'Se asignó un repartidor a tu pedido.',
                'complete_rank' => self::STATUS_RANK['outfordelivery'],
            ],
            [
                'key' => 'on_the_way',
                'title' => 'En camino',
                'description' => 'Tu pedido va en camino hacia ti.',
                'complete_rank' => self::STATUS_RANK['completed'],
            ],
            [
                'key' => 'delivered',
                'title' => 'Entregado',
                'description' => 'Disfruta tu comida. ¡Buen provecho!',
                'complete_rank' => self::STATUS_RANK['completed'],
                'timestamp' => optional($order->actual_delivery_time)->toIso8601String(),
            ],
        ];

        $steps = [];
        $foundCurrent = false;
        $completedCount = 0;

        foreach ($stepsConfig as $config) {
            $state = 'upcoming';

            if ($isCancelled) {
                if ($rank >= $config['complete_rank']) {
                    $state = 'complete';
                    $completedCount++;
                } elseif (!$foundCurrent) {
                    $state = 'cancelled';
                    $foundCurrent = true;
                } else {
                    $state = 'cancelled';
                }
            } else {
                if ($rank >= $config['complete_rank']) {
                    $state = 'complete';
                    $completedCount++;
                } elseif (!$foundCurrent) {
                    $state = 'current';
                    $foundCurrent = true;
                }
            }

            $steps[] = [
                'key' => $config['key'],
                'title' => $config['title'],
                'description' => $config['description'],
                'state' => $state,
                'timestamp' => $config['timestamp'] ?? null,
            ];
        }

        $totalSteps = max(count($steps), 1);
        $progress = (int) floor(($completedCount / $totalSteps) * 100);

        return [
            'steps' => $steps,
            'status' => $status,
            'status_label' => $this->statusLabel($status),
            'is_cancelled' => $isCancelled,
            'progress_percent' => $progress,
        ];
    }

    private function statusLabel(?string $status): string
    {
        return self::STATUS_LABELS[$status] ?? ucfirst($status ?? '');
    }

    private function formatMediaPath(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://', '/storage'])) {
            return $path;
        }

        return '/storage/' . ltrim($path, '/');
    }

    private function buildMapUrl(?float $latitude, ?float $longitude): ?string
    {
        if ($latitude === null || $longitude === null) {
            return null;
        }

        return sprintf('https://www.google.com/maps?q=%s,%s', $latitude, $longitude);
    }
}
