import { useMemo } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AppNavbar from "@/components/app-navbar";
import AppFooter from "@/components/app-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, ChevronRight, MapPin, PackageSearch, UtensilsCrossed } from "lucide-react";

interface RestaurantSummary {
    id: number;
    name: string;
    logo_url?: string | null;
}

interface OrderListItem {
    id: number;
    number: string;
    status: string;
    status_label: string;
    created_at?: string | null;
    total_amount: number;
    restaurant?: RestaurantSummary | null;
    delivery_summary?: string | null;
}

interface OrdersIndexPageProps {
    orders: OrderListItem[];
}

const statusTheme: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
    confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200",
    prepared: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200",
    outfordelivery: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-200",
    completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200",
};

const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(value);

const formatDateTime = (value?: string | null): string => {
    if (!value) {
        return "Sin registro";
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

export default function OrdersIndexPage() {
    const page = usePage();
    const props = page.props as unknown as OrdersIndexPageProps;
    const { orders } = props;

    const hasOrders = useMemo(() => orders && orders.length > 0, [orders]);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-950 dark:text-gray-200">
            <Head title="Mis pedidos | FoodMarket" />

            <AppNavbar />

            <main className="pb-20 pt-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <header className="mb-10 text-center">
                        <Badge className="mx-auto w-max bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-200">
                            Historial y seguimiento
                        </Badge>
                        <h1 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                            Mis pedidos
                        </h1>
                        <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
                            Consulta el estado actual de tus pedidos recientes y accede al seguimiento en tiempo real cuando esté disponible.
                        </p>
                    </header>

                    {!hasOrders ? (
                        <Card className="mx-auto max-w-3xl dark:border-gray-800 dark:bg-gray-900">
                            <CardContent className="flex flex-col items-center gap-4 py-10 text-center text-gray-600 dark:text-gray-400">
                                <PackageSearch className="h-12 w-12" />
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Aún no tienes pedidos registrados
                                    </h2>
                                    <p className="mt-2 text-sm">
                                        Explora nuevos restaurantes y realiza tu primer pedido para comenzar a rastrearlo aquí.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => router.visit("/restaurants")}
                                    className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
                                >
                                    Descubrir restaurantes
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 lg:grid-cols-2">
                            {orders.map((order) => {
                                const statusClass = statusTheme[order.status] ?? statusTheme.pending;

                                return (
                                    <Card key={order.id} className="flex flex-col justify-between dark:border-gray-800 dark:bg-gray-900">
                                        <CardHeader className="space-y-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <CardTitle className="text-lg text-gray-900 dark:text-white">
                                                    Pedido #{order.number}
                                                </CardTitle>
                                                <Badge className={statusClass}>{order.status_label}</Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <CalendarClock className="h-4 w-4" />
                                                    {formatDateTime(order.created_at)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <UtensilsCrossed className="h-4 w-4" />
                                                    {order.restaurant?.name ?? "Restaurante"}
                                                </span>
                                                {order.delivery_summary && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        {order.delivery_summary}
                                                    </span>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                                                <span>Total</span>
                                                <span className="text-base font-semibold text-gray-900 dark:text-white">
                                                    {formatCurrency(order.total_amount)}
                                                </span>
                                            </div>

                                            <Button
                                                type="button"
                                                onClick={() => router.visit(`/orders/${order.id}/track`)}
                                                variant="outline"
                                                className="flex w-full items-center justify-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                                            >
                                                Ver seguimiento
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            <AppFooter />
        </div>
    );
}
