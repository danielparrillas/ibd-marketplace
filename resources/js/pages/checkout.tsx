import { useCallback, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import AppNavbar from "@/components/app-navbar";
import AppFooter from "@/components/app-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { Minus, Plus, ShoppingBag, ShoppingCart } from "lucide-react";
const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);

export default function CheckoutPage() {
    const {
        items,
        restaurant,
        isLoading,
        isMutating,
        error,
        setItemQuantity,
        clearCart,
    } = useCart();

    const isCartEmpty = items.length === 0;

    const totals = useMemo(() => {
        return items.reduce(
            (acc, item) => {
                acc.subtotal += item.dish.price * item.quantity;
                acc.count += item.quantity;
                return acc;
            },
            { subtotal: 0, count: 0 },
        );
    }, [items]);

    const handleUpdateQuantity = useCallback(
        (dishId: number, nextQuantity: number) => {
            if (nextQuantity < 0) {
                return;
            }

            void setItemQuantity(dishId, nextQuantity);
        },
        [setItemQuantity],
    );

    const handlePlaceOrder = useCallback(() => {
        if (isCartEmpty) {
            return;
        }

        router.visit("/checkout/payment", {
            preserveScroll: true,
        });
    }, [isCartEmpty]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
            <Head title="Revisión de pedido | FoodMarket" />

            <AppNavbar />

            <main className="pb-20 pt-14">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 flex flex-col gap-4 text-center">
                        <Badge className="mx-auto w-max bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">
                            Revisión de pedido
                        </Badge>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                            Tu pedido está casi listo
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                            Confirma los detalles de tu orden antes de continuar. Puedes ajustar las cantidades o eliminar productos directamente desde aquí.
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        <section className="lg:col-span-2 space-y-6">
                            <Card className="dark:border-gray-800 dark:bg-gray-900">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                                        <ShoppingCart className="h-5 w-5" />
                                        Resumen del carrito
                                    </CardTitle>
                                    {restaurant && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Restaurante: <span className="font-semibold">{restaurant.business_name}</span>
                                        </p>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {error && (
                                        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-600/60 dark:bg-red-500/10 dark:text-red-200">
                                            {error}
                                        </div>
                                    )}

                                    {isLoading ? (
                                        <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                                            Cargando carrito...
                                        </div>
                                    ) : isCartEmpty ? (
                                        <div className="flex flex-col items-center gap-3 py-12 text-center">
                                            <ShoppingBag className="h-12 w-12 text-gray-400" />
                                            <p className="text-gray-600 dark:text-gray-400">Todavía no tienes productos en tu carrito.</p>
                                            <Button
                                                variant="outline"
                                                onClick={() => router.visit("/restaurants")}
                                                className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-500 dark:text-orange-400 dark:hover:bg-orange-500/10"
                                            >
                                                Explorar restaurantes
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800"
                                                >
                                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                                        <div className="h-24 w-full overflow-hidden rounded-lg bg-gray-200 sm:w-32 dark:bg-gray-700">
                                                            {item.dish.image_url ? (
                                                                <img
                                                                    src={item.dish.image_url}
                                                                    alt={item.dish.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                                                                    Sin imagen
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                                <div>
                                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                        {item.dish.name}
                                                                    </h3>
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                        {item.dish.description}
                                                                    </p>
                                                                </div>
                                                                <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                                                                    {formatCurrency(item.dish.price)}
                                                                </span>
                                                            </div>

                                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleUpdateQuantity(item.dish.id, item.quantity - 1)}
                                                                        disabled={isMutating || item.quantity <= 0}
                                                                        className="dark:border-gray-700 dark:bg-gray-700 dark:text-white hover:dark:bg-gray-600"
                                                                    >
                                                                        <Minus className="h-4 w-4" />
                                                                    </Button>
                                                                    <span className="min-w-[2rem] text-center font-semibold text-gray-900 dark:text-white">
                                                                        {item.quantity}
                                                                    </span>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleUpdateQuantity(item.dish.id, item.quantity + 1)}
                                                                        disabled={isMutating}
                                                                        className="dark:border-gray-700 dark:bg-gray-700 dark:text-white hover:dark:bg-gray-600"
                                                                    >
                                                                        <Plus className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                                    Subtotal: {formatCurrency(item.dish.price * item.quantity)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-orange-50/70 p-4 dark:bg-orange-500/10">
                                                <div>
                                                    <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                                                        ¿Necesitas editar todo el pedido?
                                                    </p>
                                                    <p className="text-xs text-orange-600 dark:text-orange-200/80">
                                                        Al vaciar el carrito podrás comenzar desde cero.
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => void clearCart()}
                                                    disabled={isMutating}
                                                    className="text-orange-600 hover:bg-orange-100 dark:text-orange-300 dark:hover:bg-orange-500/10"
                                                >
                                                    Vaciar carrito
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </section>

                        <aside className="space-y-6">
                            <Card className="dark:border-gray-800 dark:bg-gray-900">
                                <CardHeader>
                                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                                        Resumen de pago
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                        <span>Platos ({totals.count})</span>
                                        <span>{formatCurrency(totals.subtotal)}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                        <span>Envío</span>
                                        <span>Se calcula al confirmar</span>
                                    </div>

                                    <Separator className="dark:bg-gray-800" />

                                    <div className="flex items-center justify-between text-lg font-semibold text-gray-900 dark:text-white">
                                        <span>Total estimado</span>
                                        <span>{formatCurrency(totals.subtotal)}</span>
                                    </div>

                                    <Button
                                        onClick={handlePlaceOrder}
                                        disabled={isCartEmpty || isMutating}
                                        className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
                                    >
                                        Confirmar y continuar
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => router.visit("/restaurants")}
                                        className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        Seguir explorando
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="dark:border-gray-800 dark:bg-gray-900">
                                <CardHeader>
                                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                                        Información útil
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                    <p>
                                        Todos los pedidos se confirman directamente con el restaurante para asegurar la disponibilidad y los tiempos de entrega.
                                    </p>
                                    <p>
                                        Podrás elegir tu método de pago y dirección de entrega en el siguiente paso.
                                    </p>
                                    <p>
                                        ¿Tienes un código promocional? Ingresa tus beneficios en la sección de pago.
                                    </p>
                                </CardContent>
                            </Card>
                        </aside>
                    </div>
                </div>
            </main>

            <AppFooter />
        </div>
    );
}
