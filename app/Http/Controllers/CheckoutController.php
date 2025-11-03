<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\CartItem;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\InvoiceDetail;
use App\Models\InvoiceDiscount;
use App\Models\InvoicePayment;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentMethod;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    private const TAX_RATE = 0.18;
    private const DELIVERY_FEE = 7.50;

    public function __construct(private readonly CartService $cartService)
    {
    }

    public function summary(): Response
    {
        return Inertia::render('checkout');
    }

    public function payment(Request $request): Response
    {
        $user = $request->user();

    $selection = $request->session()->get('checkout.selection');

        $addresses = Address::query()
            ->where('user_id', $user->id)
            ->orderByDesc('id')
            ->get([
                'id',
                'address_line_1',
                'address_line_2',
                'delivery_instructions',
                'latitude',
                'longitude',
                'created_at',
            ]);

        $paymentMethods = PaymentMethod::query()
            ->active()
            ->orderBy('category')
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'code',
                'category',
                'supports_refunds',
            ]);

        return Inertia::render('checkout/payment', [
            'addresses' => $addresses->map(static function (Address $address): array {
                return [
                    'id' => $address->id,
                    'address_line_1' => $address->address_line_1,
                    'address_line_2' => $address->address_line_2,
                    'delivery_instructions' => $address->delivery_instructions,
                    'latitude' => $address->latitude,
                    'longitude' => $address->longitude,
                    'created_at' => optional($address->created_at)->format('Y-m-d\TH:i:sP'),
                ];
            }),
            'selection' => $selection ? [
                'address' => $selection['address'] ?? null,
                'payment_method' => $selection['payment_method'] ?? null,
                'order_notes' => $selection['order_notes'] ?? null,
                'saved_at' => $selection['saved_at'] ?? null,
            ] : null,
            'paymentMethods' => $paymentMethods->map(static function (PaymentMethod $method): array {
                return [
                    'id' => $method->id,
                    'name' => $method->name,
                    'code' => $method->code,
                    'category' => $method->category,
                    'supports_refunds' => $method->supports_refunds,
                ];
            }),
        ]);
    }

    public function placeOrder(Request $request): RedirectResponse
    {
        $user = $request->user();
        $userId = $user->id;

        $validated = $request->validate([
            'address_id' => [
                'required',
                'integer',
                Rule::exists('addresses', 'id')->where(fn ($query) => $query->where('user_id', $userId)),
            ],
            'payment_method_id' => [
                'required',
                'integer',
                Rule::exists('payment_methods', 'id')->where(fn ($query) => $query->where('is_active', true)),
            ],
            'order_notes' => ['nullable', 'string', 'max:500'],
        ]);

        $address = Address::query()
            ->where('user_id', $userId)
            ->findOrFail($validated['address_id']);

        $paymentMethod = PaymentMethod::query()
            ->active()
            ->findOrFail($validated['payment_method_id']);

        $selection = [
            'address' => [
                'id' => $address->id,
                'address_line_1' => $address->address_line_1,
                'address_line_2' => $address->address_line_2,
                'delivery_instructions' => $address->delivery_instructions,
                'latitude' => $address->latitude,
                'longitude' => $address->longitude,
            ],
            'payment_method' => [
                'id' => $paymentMethod->id,
                'name' => $paymentMethod->name,
                'code' => $paymentMethod->code,
                'category' => $paymentMethod->category,
                'supports_refunds' => $paymentMethod->supports_refunds,
            ],
            'order_notes' => $validated['order_notes'] ?? null,
            'saved_at' => now()->format('Y-m-d\TH:i:sP'),
        ];

        $request->session()->put('checkout.selection', $selection);

        $cartItems = $this->cartService->getItems($userId, null);

        if ($cartItems->isEmpty()) {
            return back()->with('error', 'Tu carrito está vacío. Agrega productos antes de realizar el pedido.');
        }

        $totals = $this->calculateTotals($cartItems);

        $customer = $this->resolveCustomerForUser($user->id, (string) $user->name);
        $restaurantId = $cartItems->first()->restaurant_id;
        $orderNumber = $this->generateUniqueOrderNumber();
        $invoiceNumber = $this->generateUniqueInvoiceNumber();
        $shippingAddress = $this->composeShippingAddress($address);
        $notes = $validated['order_notes'] ?? null;

        $now = now();

        $confirmationPayload = DB::transaction(function () use (
            $user,
            $customer,
            $restaurantId,
            $orderNumber,
            $invoiceNumber,
            $cartItems,
            $paymentMethod,
            $totals,
            $shippingAddress,
            $notes,
            $selection,
            $now
        ) {
            $paymentReference = $orderNumber . '-' . Str::upper(Str::random(4));

            $order = Order::query()->create([
                'order_number' => $orderNumber,
                'customer_id' => $customer->id,
                'restaurant_id' => $restaurantId,
                'delivery_address_id' => $selection['address']['id'],
                'order_type' => 'delivery',
                'status' => 'pending',
                'subtotal' => $totals['subtotal'],
                'tax_amount' => $totals['tax'],
                'delivery_fee' => $totals['deliveryFee'],
                'discount_amount' => $totals['discount'],
                'total_amount' => $totals['total'],
                'payment_method' => $paymentMethod->code,
                'payment_status' => 'paid',
                'payment_reference' => $paymentReference,
                'special_instructions' => $notes,
            ]);

            $invoice = Invoice::query()->create([
                'user_id' => $user->id,
                'restaurant_id' => $restaurantId,
                'invoice_number' => $invoiceNumber,
                'invoice_date' => $now,
                'sub_total' => $totals['subtotal'],
                'delivery_fee' => $totals['deliveryFee'],
                'tax_amount' => $totals['tax'],
                'discount_amount' => $totals['discount'],
                'total_amount' => $totals['total'],
                'status' => 'issued',
                'shipping_address' => $shippingAddress,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $orderItemsSummary = [];

            foreach ($cartItems as $cartItem) {
                $unitPrice = (float) $cartItem->dish->price;
                $lineTotal = round($unitPrice * $cartItem->quantity, 2);

                $orderItem = OrderItem::query()->create([
                    'order_id' => $order->id,
                    'item_type' => 'dish',
                    'dish_id' => $cartItem->dish_id,
                    'combo_id' => null,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $lineTotal,
                    'special_requests' => $notes,
                ]);

                $invoiceDetail = InvoiceDetail::query()->create([
                    'invoice_id' => $invoice->invoice_id,
                    'dish_id' => $cartItem->dish_id,
                    'dish_name' => $cartItem->dish->name,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $unitPrice,
                    'line_total' => $lineTotal,
                    'options_json' => json_encode($cartItem->options ?? []),
                ]);

                InvoiceDiscount::query()->create([
                    'invoice_detail_id' => $invoiceDetail->invoice_detail_id,
                    'discount_type' => 'none',
                    'discount_value' => 0,
                    'discount_rate' => null,
                    'discount_amount' => 0,
                    'coupon_code' => null,
                ]);

                $orderItemsSummary[] = [
                    'id' => $orderItem->id,
                    'dish_name' => $cartItem->dish->name,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $unitPrice,
                    'line_total' => $lineTotal,
                    'options' => $cartItem->options ?? [],
                ];
            }

            $paymentRecord = InvoicePayment::query()->create([
                'invoice_id' => $invoice->invoice_id,
                'payment_method_id' => $paymentMethod->id,
                'payment_gateway' => 'internal',
                'gateway_transaction_id' => $paymentReference,
                'amount_paid' => $totals['total'],
                'payment_status' => 'paid',
                'paid_at' => $now,
            ]);

            $this->cartService->clearOwner([
                'user_id' => $user->id,
                'session_token' => null,
            ]);

            return [
                'order' => [
                    'id' => $order->id,
                    'number' => $order->order_number,
                    'status' => $order->status,
                    'subtotal' => $totals['subtotal'],
                    'tax_amount' => $totals['tax'],
                    'delivery_fee' => $totals['deliveryFee'],
                    'discount_amount' => $totals['discount'],
                    'total_amount' => $totals['total'],
                    'payment_method' => $paymentMethod->name,
                    'payment_status' => $order->payment_status,
                    'payment_reference' => $paymentReference,
                    'created_at' => optional($order->created_at)->format('Y-m-d\TH:i:sP'),
                    'notes' => $notes,
                ],
                'restaurant' => [
                    'id' => $restaurantId,
                    'name' => $cartItems->first()->restaurant->business_name ?? 'Restaurante asignado',
                ],
                'address' => $selection['address'],
                'payment_method' => $selection['payment_method'],
                'items' => $orderItemsSummary,
                'invoice' => [
                    'number' => $invoice->invoice_number,
                    'date' => $invoice->invoice_date?->format('Y-m-d\TH:i:sP'),
                    'sub_total' => $totals['subtotal'],
                    'delivery_fee' => $totals['deliveryFee'],
                    'tax_amount' => $totals['tax'],
                    'discount_amount' => $totals['discount'],
                    'total_amount' => $totals['total'],
                    'payments' => [[
                        'amount_paid' => (float) $paymentRecord->amount_paid,
                        'status' => $paymentRecord->payment_status,
                        'paid_at' => $paymentRecord->paid_at?->format('Y-m-d\TH:i:sP'),
                        'method' => $paymentMethod->name,
                    ]],
                ],
            ];
        });

        $request->session()->put('checkout.confirmation', $confirmationPayload);

        return redirect()
            ->route('checkout.confirmation')
            ->with('success', '¡Tu pedido fue creado con éxito!');
    }

    public function confirmation(Request $request): Response|RedirectResponse
    {
        $payload = $request->session()->get('checkout.confirmation');

        if (!$payload) {
            return redirect()->route('checkout.payment');
        }

        return Inertia::render('checkout/confirmation', $payload);
    }

    private function calculateTotals(Collection $cartItems): array
    {
        $subtotal = $cartItems->reduce(function (float $carry, CartItem $item) {
            $unitPrice = (float) $item->dish->price;

            return $carry + ($unitPrice * $item->quantity);
        }, 0.0);

        $subtotal = round($subtotal, 2);
        $tax = round($subtotal * self::TAX_RATE, 2);
        $deliveryFee = round(self::DELIVERY_FEE, 2);
        $discount = 0.0;
        $total = round($subtotal + $tax + $deliveryFee - $discount, 2);

        return [
            'subtotal' => $subtotal,
            'tax' => $tax,
            'deliveryFee' => $deliveryFee,
            'discount' => $discount,
            'total' => $total,
        ];
    }

    private function composeShippingAddress(Address $address): string
    {
        $parts = [$address->address_line_1];

        if ($address->address_line_2) {
            $parts[] = $address->address_line_2;
        }

        if ($address->delivery_instructions) {
            $parts[] = 'Indicaciones: ' . $address->delivery_instructions;
        }

        if ($address->latitude !== null && $address->longitude !== null) {
            $parts[] = sprintf('Ubicación: %s, %s', $address->latitude, $address->longitude);
        }

        return implode(' | ', array_filter($parts));
    }

    private function resolveCustomerForUser(int $userId, string $fullName): Customer
    {
        $customer = Customer::query()->where('user_id', $userId)->first();

        if ($customer) {
            return $customer;
        }

        [$firstName, $lastName] = $this->splitFullName($fullName);

        return Customer::query()->create([
            'user_id' => $userId,
            'first_name' => $firstName,
            'last_name' => $lastName,
        ]);
    }

    private function splitFullName(string $fullName): array
    {
        $trimmed = trim($fullName);

        if ($trimmed === '') {
            return ['Cliente', 'FoodMarket'];
        }

        $parts = preg_split('/\s+/', $trimmed, 2) ?: [];

        $firstName = $parts[0] ?? $trimmed;
        $lastName = $parts[1] ?? $firstName;

        return [$firstName, $lastName];
    }

    private function generateUniqueOrderNumber(): string
    {
        do {
            $candidate = 'ORD-' . now()->format('ymd') . '-' . Str::upper(Str::random(5));
        } while (Order::query()->where('order_number', $candidate)->exists());

        return $candidate;
    }

    private function generateUniqueInvoiceNumber(): string
    {
        do {
            $candidate = 'INV-' . now()->format('ymd') . '-' . Str::upper(Str::random(5));
        } while (Invoice::query()->where('invoice_number', $candidate)->exists());

        return $candidate;
    }
}
