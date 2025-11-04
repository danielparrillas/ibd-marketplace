import { useMemo } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AppNavbar from "@/components/app-navbar";
import AppFooter from "@/components/app-footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, CreditCard, Home, MapPin, NotebookPen, Receipt, UtensilsCrossed } from "lucide-react";

interface AddressSummary {
    id: number;
    address_line_1: string;
    address_line_2?: string | null;
    delivery_instructions?: string | null;
    latitude?: number | null;
    longitude?: number | null;
}

interface PaymentMethodSummary {
    id: number;
    name: string;
    code: string;
    category: string;
    supports_refunds: boolean;
}

interface OrderItemSummary {
    id: number;
    dish_name: string;
    quantity: number;
    unit_price: number;
    line_total: number;
    options: Record<string, unknown>;
}

interface OrderSummary {
    id: number;
    number: string;
    status: string;
    subtotal: number;
    tax_amount: number;
    delivery_fee: number;
    discount_amount: number;
    total_amount: number;
    payment_method: string;
    payment_status: string;
    payment_reference?: string;
    created_at?: string | null;
    notes?: string | null;
}

interface InvoicePaymentSummary {
    amount_paid: number;
    status: string;
    paid_at?: string | null;
    method: string;
}

interface InvoiceSummary {
    number: string;
    date?: string | null;
    sub_total: number;
    delivery_fee: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    payments: InvoicePaymentSummary[];
}

interface RestaurantSummary {
    id: number;
    name: string;
}

interface FlashMessages {
    success?: string | null;
    error?: string | null;
}

interface PageProps extends Record<string, unknown> {
    order: OrderSummary;
    invoice: InvoiceSummary;
    address: AddressSummary;
    payment_method: PaymentMethodSummary;
    items: OrderItemSummary[];
    restaurant: RestaurantSummary;
    flash?: FlashMessages;
}

const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);

const formatDateTime = (value?: string | null): string | null => {
    if (!value) {
        return null;
    }

    try {
        return new Intl.DateTimeFormat("es-PE", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(value));
    } catch {
        return value;
    }
};

export default function CheckoutConfirmationPage() {
    const { props } = usePage<PageProps & { auth?: { user?: { email?: string; name?: string } } }>();
    const { order, invoice, address, items, restaurant, flash } = props;
    const customerEmail = props.auth?.user?.email ?? "tu correo registrado";

    const placedAt = useMemo(() => formatDateTime(order.created_at), [order.created_at]);
    const invoiceIssuedAt = useMemo(() => formatDateTime(invoice.date), [invoice.date]);
    const primaryPayment = invoice.payments[0];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
            <Head title="Pedido confirmado | FoodMarket" />

            <AppNavbar />

            <main className="pb-20 pt-14">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 flex flex-col gap-4 text-center">
                        <Badge className="mx-auto w-max bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                            Pedido confirmado
                        </Badge>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                            ¡Gracias por tu compra!
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                            El pedido <span className="font-semibold">#{order.number}</span> fue registrado correctamente con el restaurante {restaurant.name}.
                            {placedAt ? ` (${placedAt})` : null}
                        </p>
                        {order.payment_reference && (
                            <p className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                                Número de referencia de pago: <span className="font-semibold text-gray-900 dark:text-white">{order.payment_reference}</span>
                            </p>
                        )}
                        <p className="mx-auto max-w-xl rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-500/50 dark:bg-blue-500/10 dark:text-blue-200">
                            Enviaremos la factura electrónica al correo <span className="font-semibold">{customerEmail}</span> apenas se procese el pago.
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                        <section className="space-y-6">
                            {flash?.success && (
                                <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-200">
                                    <AlertTitle className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4" /> Éxito
                                    </AlertTitle>
                                    <AlertDescription>{flash.success}</AlertDescription>
                                </Alert>
                            )}
                            {flash?.error && (
                                <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700 dark:border-red-500/60 dark:bg-red-500/10 dark:text-red-200">
                                    <AlertTitle>Atención</AlertTitle>
                                    <AlertDescription>{flash.error}</AlertDescription>
                                </Alert>
                            )}

                            <Card className="dark:border-gray-800 dark:bg-gray-900">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                                        <UtensilsCrossed className="h-5 w-5" /> Resumen del pedido
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <div className="flex items-center justify-between">
                                            <span>Subtotal</span>
                                            <span>{formatCurrency(order.subtotal)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Impuestos</span>
                                            <span>{formatCurrency(order.tax_amount)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Envío</span>
                                            <span>{formatCurrency(order.delivery_fee)}</span>
                                        </div>
                                        {order.discount_amount > 0 && (
                                            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-300">
                                                <span>Descuentos</span>
                                                <span>-{formatCurrency(order.discount_amount)}</span>
                                            </div>
                                        )}
                                        <div className="border-t border-gray-200 pt-3 text-base font-semibold text-gray-900 dark:border-gray-700 dark:text-white">
                                            <div className="flex items-center justify-between">
                                                <span>Total pagado</span>
                                                <span>{formatCurrency(order.total_amount)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                        Estado del pago: <span className="font-semibold text-emerald-600 dark:text-emerald-300">{order.payment_status}</span> mediante {order.payment_method}.
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="dark:border-gray-800 dark:bg-gray-900">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                                        <Home className="h-5 w-5" /> Entrega y contacto
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">Dirección seleccionada</p>
                                        <p>{address.address_line_1}</p>
                                        {address.address_line_2 && <p>{address.address_line_2}</p>}
                                        {address.delivery_instructions && (
                                            <p className="italic text-gray-500 dark:text-gray-400">
                                                Indicaciones: {address.delivery_instructions}
                                            </p>
                                        )}
                                        {(address.latitude || address.longitude) && (
                                            <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {address.latitude ?? "?"}, {address.longitude ?? "?"}
                                            </p>
                                        )}
                                    </div>
                                    <div className="rounded-lg bg-orange-50 px-4 py-3 text-sm text-orange-700 dark:bg-orange-500/10 dark:text-orange-200">
                                        Restaurante asignado: <span className="font-semibold">{restaurant.name}</span>.
                                    </div>
                                    {order.notes ? (
                                        <div className="rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
                                            <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                                                <NotebookPen className="h-4 w-4" /> Notas para el pedido
                                            </div>
                                            <p className="mt-2">{order.notes}</p>
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-dashed border-gray-200 px-4 py-3 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                                            No registraste notas adicionales para este pedido.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="dark:border-gray-800 dark:bg-gray-900">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                                        <Receipt className="h-5 w-5" /> Detalle de productos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="rounded-lg border border-gray-100 p-4 shadow-sm dark:border-gray-800">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-base font-semibold text-gray-900 dark:text-white">{item.dish_name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Cantidad: {item.quantity} × {formatCurrency(item.unit_price)}
                                                    </p>
                                                </div>
                                                <p className="text-base font-semibold text-gray-900 dark:text-white">
                                                    {formatCurrency(item.line_total)}
                                                </p>
                                            </div>
                                            {item.options && Object.keys(item.options).length > 0 && (
                                                <div className="mt-2 rounded-md bg-gray-100 px-3 py-2 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                                    Personalizaciones: {JSON.stringify(item.options)}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <div className="flex flex-wrap items-center gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit("/orders")}
                                    className="border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                                >
                                    Mis pedidos
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => router.visit("/restaurants")}
                                    className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
                                >
                                    Descubrir más restaurantes
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit("/checkout")}
                                    className="border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    Ver otro pedido
                                </Button>
                            </div>
                        </section>

                        <aside className="space-y-6">
                            <Card className="dark:border-gray-800 dark:bg-gray-900">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                                        <CreditCard className="h-5 w-5" /> Facturación
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">Factura #{invoice.number}</p>
                                        {invoiceIssuedAt && <p>Emitida el {invoiceIssuedAt}</p>}
                                    </div>
                                    <div className="space-y-2 rounded-lg bg-gray-100 px-4 py-3 dark:bg-gray-800">
                                        <div className="flex items-center justify-between">
                                            <span>Subtotal</span>
                                            <span>{formatCurrency(invoice.sub_total)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Impuestos</span>
                                            <span>{formatCurrency(invoice.tax_amount)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Envío</span>
                                            <span>{formatCurrency(invoice.delivery_fee)}</span>
                                        </div>
                                        {invoice.discount_amount > 0 && (
                                            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-300">
                                                <span>Descuentos</span>
                                                <span>-{formatCurrency(invoice.discount_amount)}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-base font-semibold text-gray-900 dark:border-gray-700 dark:text-white">
                                            <span>Total facturado</span>
                                            <span>{formatCurrency(invoice.total_amount)}</span>
                                        </div>
                                    </div>
                                    {primaryPayment && (
                                        <div className="rounded-lg border border-dashed border-gray-300 px-4 py-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                                            Pago registrado: {formatCurrency(primaryPayment.amount_paid)} vía {primaryPayment.method}.
                                            {primaryPayment.paid_at ? ` (${formatDateTime(primaryPayment.paid_at)})` : ""}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Alert className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/50 dark:bg-blue-500/10 dark:text-blue-200">
                                <AlertTitle>¿Qué sigue?</AlertTitle>
                                <AlertDescription>
                                    El restaurante confirmará la preparación y coordinará la entrega a la dirección indicada. Te avisaremos por correo si hay novedades sobre tu pedido o factura.
                                </AlertDescription>
                            </Alert>
                        </aside>
                    </div>
                </div>
            </main>

            <AppFooter />
        </div>
    );
}
