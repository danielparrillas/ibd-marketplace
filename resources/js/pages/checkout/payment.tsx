import { FormEvent, useMemo } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import AppNavbar from "@/components/app-navbar";
import AppFooter from "@/components/app-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InputError from "@/components/input-error";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { CreditCard, Home, MapPin } from "lucide-react";

interface AddressOption {
    id: number;
    address_line_1: string;
    address_line_2?: string | null;
    delivery_instructions?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    created_at?: string | null;
}

interface PaymentMethodOption {
    id: number;
    name: string;
    code: string;
    category: string;
    supports_refunds: boolean;
}

interface StoredSelection {
    address?: AddressOption | null;
    payment_method?: PaymentMethodOption | null;
    order_notes?: string | null;
    saved_at?: string | null;
}

interface FlashMessages {
    success?: string | null;
    error?: string | null;
}

interface PageProps extends Record<string, unknown> {
    addresses: AddressOption[];
    paymentMethods: PaymentMethodOption[];
    selection?: StoredSelection | null;
    flash?: FlashMessages;
}

interface FormData {
    address_id: number | null;
    payment_method_id: number | null;
    order_notes: string;
}

export default function CheckoutPaymentPage() {
    const { props } = usePage<PageProps>();
    const {
        addresses,
        paymentMethods,
        selection,
        flash,
    } = props;

    const initialAddressId = useMemo(() => {
        if (selection?.address?.id && addresses.some((address) => address.id === selection.address?.id)) {
            return selection.address.id;
        }

        return addresses.length > 0 ? addresses[0].id : null;
    }, [addresses, selection]);

    const initialPaymentMethodId = useMemo(() => {
        if (selection?.payment_method?.id && paymentMethods.some((method) => method.id === selection.payment_method?.id)) {
            return selection.payment_method.id;
        }

        return paymentMethods.length > 0 ? paymentMethods[0].id : null;
    }, [paymentMethods, selection]);

    const { data, setData, post, processing, errors } = useForm<FormData>({
        address_id: initialAddressId,
        payment_method_id: initialPaymentMethodId,
        order_notes: selection?.order_notes ?? "",
    });

    const canSubmit = addresses.length > 0 && paymentMethods.length > 0 && data.address_id !== null && data.payment_method_id !== null;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!canSubmit || processing) {
            return;
        }

        post("/checkout/payment", {
            preserveScroll: true,
        });
    };

    const formatDate = (value?: string | null) => {
        if (!value) {
            return null;
        }

        try {
            return new Intl.DateTimeFormat("es-PE", {
                dateStyle: "medium",
                timeStyle: "short",
            }).format(new Date(value));
        } catch (error) {
            return value;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
            <Head title="Pago y entrega | FoodMarket" />

            <AppNavbar />

            <main className="pb-20 pt-14">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 flex flex-col gap-4 text-center">
                        <Badge className="mx-auto w-max bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">
                            Pago y entrega
                        </Badge>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                            Elige cómo recibir y pagar tu pedido
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                            Selecciona la dirección de entrega y el método de pago que prefieras. Puedes guardar notas para el restaurante antes de continuar.
                        </p>
                        {selection?.saved_at && (
                            <p className="mx-auto max-w-xl rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-600/60 dark:bg-emerald-500/10 dark:text-emerald-200">
                                Última selección guardada: {formatDate(selection.saved_at)}.
                            </p>
                        )}
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {flash?.error && (
                                <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700 dark:border-red-500/60 dark:bg-red-500/10 dark:text-red-200">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{flash.error}</AlertDescription>
                                </Alert>
                            )}

                            <Card className="dark:border-gray-800 dark:bg-gray-900">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                                        <Home className="h-5 w-5" />
                                        Direcciones de entrega
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {addresses.length === 0 ? (
                                        <div className="space-y-3 rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                            <p>No tienes direcciones registradas todavía.</p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => router.visit("/addresses")}
                                                className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-500 dark:text-orange-300 dark:hover:bg-orange-500/10"
                                            >
                                                Administrar direcciones
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {addresses.map((address) => (
                                                <label
                                                    key={address.id}
                                                    className={cn(
                                                        "flex cursor-pointer gap-4 rounded-xl border bg-white p-4 transition hover:border-orange-300 hover:bg-orange-50/50 dark:bg-gray-800",
                                                        data.address_id === address.id
                                                            ? "border-orange-400 shadow-sm dark:border-orange-500"
                                                            : "border-gray-200 dark:border-gray-700",
                                                    )}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="address_id"
                                                        value={address.id}
                                                        checked={data.address_id === address.id}
                                                        onChange={() => setData("address_id", address.id)}
                                                        className="mt-1 h-4 w-4"
                                                    />
                                                    <div className="flex-1 space-y-1">
                                                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                                                            {address.address_line_1}
                                                        </p>
                                                        {address.address_line_2 && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                                {address.address_line_2}
                                                            </p>
                                                        )}
                                                        {address.delivery_instructions && (
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                Instrucciones: {address.delivery_instructions}
                                                            </p>
                                                        )}
                                                        {(address.latitude || address.longitude) && (
                                                            <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                                <MapPin className="h-3.5 w-3.5" />
                                                                {address.latitude ?? "?"}, {address.longitude ?? "?"}
                                                            </p>
                                                        )}
                                                        {address.created_at && (
                                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                                Guardada el {formatDate(address.created_at)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                    <InputError message={errors.address_id} />
                                </CardContent>
                            </Card>

                            <Card className="dark:border-gray-800 dark:bg-gray-900">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                                        <CreditCard className="h-5 w-5" />
                                        Métodos de pago disponibles
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {paymentMethods.length === 0 ? (
                                        <p className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                            No hay métodos de pago activos en este momento. Por favor, intenta más tarde.
                                        </p>
                                    ) : (
                                        paymentMethods.map((method) => (
                                            <label
                                                key={method.id}
                                                className={cn(
                                                    "flex cursor-pointer items-start gap-4 rounded-xl border bg-white p-4 transition hover:border-orange-300 hover:bg-orange-50/50 dark:bg-gray-800",
                                                    data.payment_method_id === method.id
                                                        ? "border-orange-400 shadow-sm dark:border-orange-500"
                                                        : "border-gray-200 dark:border-gray-700",
                                                )}
                                            >
                                                <input
                                                    type="radio"
                                                    name="payment_method_id"
                                                    value={method.id}
                                                    checked={data.payment_method_id === method.id}
                                                    onChange={() => setData("payment_method_id", method.id)}
                                                    className="mt-1 h-4 w-4"
                                                />
                                                <div>
                                                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                                                        {method.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        Categoría: {method.category}
                                                    </p>
                                                    <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500">
                                                        Código interno: {method.code}
                                                    </p>
                                                    {method.supports_refunds && (
                                                        <p className="mt-1 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                                            Permite reembolsos
                                                        </p>
                                                    )}
                                                </div>
                                            </label>
                                        ))
                                    )}
                                    <InputError message={errors.payment_method_id} />
                                </CardContent>
                            </Card>

                            <Card className="dark:border-gray-800 dark:bg-gray-900">
                                <CardHeader>
                                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                                        Notas para tu pedido
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Label htmlFor="order_notes" className="text-sm text-gray-600 dark:text-gray-300">
                                        Puedes dejar comentarios relevantes para la entrega o para el restaurante.
                                    </Label>
                                    <Textarea
                                        id="order_notes"
                                        rows={4}
                                        maxLength={500}
                                        value={data.order_notes}
                                        onChange={(event) => setData("order_notes", event.target.value)}
                                        placeholder="Ej. Entregar en portería o incluir salsa extra."
                                        className="min-h-[120px]"
                                    />
                                    <InputError message={errors.order_notes} />
                                </CardContent>
                            </Card>

                            <div className="flex flex-wrap items-center gap-3">
                                <Button
                                    type="submit"
                                    disabled={!canSubmit || processing}
                                    className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
                                >
                                    Realizar pedido
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit("/checkout")}
                                    className="border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    Volver al resumen
                                </Button>
                            </div>
                        </form>

                        <aside className="space-y-6">
                            {flash?.success && (
                                <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-200">
                                    <AlertTitle>Listo</AlertTitle>
                                    <AlertDescription>{flash.success}</AlertDescription>
                                </Alert>
                            )}
                            <Card className="dark:border-gray-800 dark:bg-gray-900">
                                <CardHeader>
                                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                                        Sugerencias útiles
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                    <p>Verifica que la dirección esté completa y contenga referencias claras para el repartidor.</p>
                                    <p>Si necesitas agregar una nueva dirección, usa el botón "Administrar direcciones" en esta página.</p>
                                    <p>Los métodos de pago disponibles pueden variar según el restaurante y la zona.</p>
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
