import { useMemo } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AppNavbar from "@/components/app-navbar";
import AppFooter from "@/components/app-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    CheckCircle2,
    Circle,
    Clock,
    Loader2,
    MapPin,
    Phone,
    Truck,
    UtensilsCrossed,
    XCircle,
    Navigation2,
    UserRound,
} from "lucide-react";

interface OrderSummary {
    id: number;
    number: string;
    status: string;
    status_label: string;
    subtotal: number;
    tax_amount: number;
    delivery_fee: number;
    discount_amount: number;
    total_amount: number;
    payment_method: string;
    payment_status: string;
    payment_reference?: string | null;
    special_instructions?: string | null;
    estimated_delivery_time?: string | null;
    actual_delivery_time?: string | null;
    created_at?: string | null;
}

interface RestaurantSummary {
    id: number;
    name: string;
    phone?: string | null;
    logo_url?: string | null;
}

interface AddressSummary {
    line_1: string;
    line_2?: string | null;
    instructions?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    map_url?: string | null;
}

interface OrderItemSummary {
    id: number;
    name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    image_url?: string | null;
    type: string;
}

interface TimelineStep {
    key: string;
    title: string;
    description: string;
    state: "complete" | "current" | "upcoming" | "cancelled";
    timestamp?: string | null;
}

interface TimelineData {
    steps: TimelineStep[];
    status: string;
    status_label: string;
    is_cancelled: boolean;
    progress_percent: number;
}

interface TrackingPageProps {
    order: OrderSummary;
    restaurant?: RestaurantSummary | null;
    address?: AddressSummary | null;
    items: OrderItemSummary[];
    timeline: TimelineData;
    eta_minutes?: number | null;
    courier?: {
        name?: string | null;
        phone?: string | null;
        avatar_url?: string | null;
        vehicle?: string | null;
    } | null;
}

const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
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

const stateStyles: Record<TimelineStep["state"], string> = {
    complete: "border-emerald-500 bg-emerald-500 text-white dark:border-emerald-400 dark:bg-emerald-400",
    current: "border-orange-500 bg-orange-500 text-white dark:border-orange-400 dark:bg-orange-400",
    upcoming: "border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400",
    cancelled: "border-red-500 bg-red-500 text-white dark:border-red-400 dark:bg-red-400",
};

const iconForState = (state: TimelineStep["state"]) => {
    switch (state) {
        case "complete":
            return <CheckCircle2 className="h-5 w-5" />;
        case "current":
            return <Loader2 className="h-5 w-5 animate-spin" />;
        case "cancelled":
            return <XCircle className="h-5 w-5" />;
        default:
            return <Circle className="h-5 w-5" />;
    }
};

export default function OrderTrackingPage() {
    const page = usePage();
    const props = page.props as unknown as TrackingPageProps;
    const { order, restaurant, address, items, timeline, eta_minutes: etaMinutes, courier } = props;

    const progressPercent = useMemo(() => {
        if (!timeline?.steps?.length) {
            return 0;
        }

        const clamped = Math.min(Math.max(timeline.progress_percent ?? 0, 0), 100);
        return clamped;
    }, [timeline]);

    const completedSteps = useMemo(() => timeline.steps.filter((step) => step.state === "complete").length, [timeline.steps]);

    const nextStep = useMemo(() => timeline.steps.find((step) => step.state === "current") ?? null, [timeline.steps]);

    const formattedEta = useMemo(() => {
        const timestamp = timeline.steps.find((step) => step.key === "delivered")?.timestamp;
        return timestamp ? formatDateTime(timestamp) : null;
    }, [timeline.steps]);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-950 dark:text-gray-200">
            <Head title={`Seguimiento pedido #${order.number} | FoodMarket`} />

            <AppNavbar />

            <main className="pb-24 pt-14">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <section className="mb-10 space-y-4">
                        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-200">
                                    Pedido #{order.number}
                                </Badge>
                                <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                                    Seguimiento en tiempo real
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                                    Te mantenemos al tanto del progreso de tu pedido. Actualizamos la línea de tiempo conforme el restaurante y el repartidor avanzan.
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <Badge className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900">
                                    {timeline.status_label}
                                </Badge>
                                {etaMinutes ? (
                                    <div className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                                        <Clock className="h-4 w-4" />
                                        Entrega en aproximadamente {etaMinutes} min
                                    </div>
                                ) : null}
                                {formattedEta && timeline.status === "completed" ? (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Entregado el {formattedEta}</p>
                                ) : null}
                            </div>
                        </div>

                        {timeline.is_cancelled && (
                            <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700 dark:border-red-500/50 dark:bg-red-500/10 dark:text-red-200">
                                <AlertTitle>Pedido cancelado</AlertTitle>
                                <AlertDescription>
                                    Este pedido fue cancelado. Si tienes dudas, comunícate con el restaurante o con nuestro equipo de soporte.
                                </AlertDescription>
                            </Alert>
                        )}
                    </section>

                    <section className="mb-16">
                        <div className="relative mb-10 hidden h-1 rounded-full bg-gray-200 dark:bg-gray-800 sm:block">
                            <div
                                className="absolute inset-y-0 left-0 rounded-full bg-orange-500 transition-all dark:bg-orange-400"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-6">
                            {timeline.steps.map((step) => {
                                const stateClass = stateStyles[step.state];
                                const formattedTimestamp = formatDateTime(step.timestamp);

                                return (
                                    <div key={step.key} className="sm:col-span-1">
                                        <div className="flex items-center gap-3 sm:flex-col sm:items-start">
                                            <div
                                                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 ${stateClass}`}
                                            >
                                                {iconForState(step.state)}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {step.title}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                                                {formattedTimestamp ? (
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">{formattedTimestamp}</p>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                        <div className="space-y-8">
                            <Card className="dark:border-gray-800 dark:bg-gray-900">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                                        <Truck className="h-5 w-5" />
                                        Estado actual
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                                    <p>
                                        {nextStep ? (
                                            <>
                                                Estamos en la etapa <span className="font-semibold text-gray-900 dark:text-white">{nextStep.title}</span>. {nextStep.description}
                                            </>
                                        ) : (
                                            "Todos los pasos están completados."
                                        )}
                                    </p>
                                    <p>
                                        Ya completamos <span className="font-semibold text-gray-900 dark:text-white">{completedSteps}</span> de {timeline.steps.length} pasos del proceso.
                                    </p>

                                    {order.special_instructions ? (
                                        <div className="rounded-lg border border-dashed border-gray-300 px-4 py-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                                            <p className="font-semibold text-gray-900 dark:text-white">Notas del pedido</p>
                                            <p className="mt-1">{order.special_instructions}</p>
                                        </div>
                                    ) : null}
                                </CardContent>
                            </Card>

                            <Card className="dark:border-gray-800 dark:bg-gray-900">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                                        <UtensilsCrossed className="h-5 w-5" />
                                        Resumen del restaurante
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                                    {restaurant ? (
                                        <>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">{restaurant.name}</p>
                                                {restaurant.phone ? (
                                                    <p className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                        <Phone className="h-4 w-4" /> {restaurant.phone}
                                                    </p>
                                                ) : null}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => router.visit(`/restaurants/${restaurant.id}`)}
                                                className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                                            >
                                                Ver restaurante
                                            </Button>
                                        </>
                                    ) : (
                                        <p>No encontramos información del restaurante.</p>
                                    )}
                                </CardContent>
                            </Card>

                            {courier ? (
                                <Card className="dark:border-gray-800 dark:bg-gray-900">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                                            <UserRound className="h-5 w-5" />
                                            Tu repartidor
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                                        {courier.name ? (
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{courier.name}</p>
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Repartidor asignado</p>
                                        )}
                                        {courier.phone ? (
                                            <a
                                                href={`tel:${courier.phone}`}
                                                className="flex items-center gap-2 text-xs text-orange-600 hover:underline dark:text-orange-300"
                                            >
                                                <Phone className="h-4 w-4" />
                                                Llamar al repartidor
                                            </a>
                                        ) : (
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                No tenemos teléfono del repartidor.
                                            </p>
                                        )}
                                        {courier.vehicle ? (
                                            <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <Navigation2 className="h-4 w-4" />
                                                {courier.vehicle}
                                            </p>
                                        ) : null}
                                    </CardContent>
                                </Card>
                            ) : null}

                            <Card className="dark:border-gray-800 dark:bg-gray-900">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                                        <MapPin className="h-5 w-5" />
                                        Dirección de entrega
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                                    {address ? (
                                        <>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">{address.line_1}</p>
                                                {address.line_2 ? <p>{address.line_2}</p> : null}
                                                {address.instructions ? (
                                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Indicaciones: {address.instructions}</p>
                                                ) : null}
                                            </div>
                                            {address.map_url ? (
                                                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                                                    <iframe
                                                        title="Mapa de entrega"
                                                        src={`${address.map_url}&output=embed`}
                                                        className="h-56 w-full"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                                    <Navigation2 className="h-4 w-4" />
                                                    Coordenadas no disponibles para mostrar el mapa.
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p>No registramos dirección para este pedido (retiro en local).</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <aside className="space-y-6">
                            <Card className="dark:border-gray-800 dark:bg-gray-900">
                                <CardHeader>
                                    <CardTitle className="text-lg text-gray-900 dark:text-white">Resumen de pago</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
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
                                    {order.discount_amount > 0 ? (
                                        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-300">
                                            <span>Descuento</span>
                                            <span>-{formatCurrency(order.discount_amount)}</span>
                                        </div>
                                    ) : null}
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-base font-semibold text-gray-900 dark:border-gray-700 dark:text-white">
                                        <span>Total</span>
                                        <span>{formatCurrency(order.total_amount)}</span>
                                    </div>
                                    <div className="rounded-lg bg-gray-100 px-4 py-3 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                        Método: <span className="font-semibold text-gray-900 dark:text-white">{order.payment_method}</span> — {order.payment_status}
                                        {order.payment_reference ? ` (${order.payment_reference})` : ""}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="dark:border-gray-800 dark:bg-gray-900">
                                <CardHeader>
                                    <CardTitle className="text-lg text-gray-900 dark:text-white">Productos</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                                    {items.length === 0 ? (
                                        <p>No hay productos asociados a este pedido.</p>
                                    ) : (
                                        items.map((item) => (
                                            <div key={item.id} className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {item.quantity} × {formatCurrency(item.unit_price)}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(item.total_price)}</p>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>

                            <div className="space-y-3">
                                <Button
                                    type="button"
                                    onClick={() => router.visit("/orders")}
                                    className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
                                >
                                    Ver todos mis pedidos
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit("/restaurants")}
                                    className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                                >
                                    Hacer otro pedido
                                </Button>
                            </div>
                        </aside>
                    </section>
                </div>
            </main>

            <AppFooter />
        </div>
    );
}
