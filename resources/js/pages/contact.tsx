import { useEffect, useRef, useState, type FormEvent } from "react";
import { Head } from "@inertiajs/react";
import AppNavbar from "@/components/app-navbar";
import AppFooter from "@/components/app-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, Headset, MessageCircle, Send } from "lucide-react";

type FormStatus = "idle" | "success";

const CONTACT_CHANNELS = [
    {
        id: "soporte",
        title: "Soporte al Cliente",
        description: "Recibe ayuda con tus pedidos, pagos o entregas en cuestión de minutos.",
        icon: Headset,
        action: "Línea directa",
        link: "tel:+50377777777",
        display: "+503 7777 7777",
    },
    {
        id: "partners",
        title: "Alianzas Comerciales",
        description: "¿Quieres vender en FoodMarket? Coordinemos una demo y una propuesta personalizada.",
        icon: MessageCircle,
        action: "Escríbenos",
        link: "mailto:partners@foodmarket.com",
        display: "partners@foodmarket.com",
    },
    {
        id: "visitanos",
        title: "Oficinas",
        description: "Visítanos para degustaciones, talleres culinarios y presentaciones de producto.",
        icon: MapPin,
        action: "Agendar visita",
        link: "https://maps.google.com?q=FoodMarket%20HQ",
        display: "Final Calle La Mascota, San Salvador, El Salvador",
    },
];

export default function ContactPage() {
    const [status, setStatus] = useState<FormStatus>("idle");
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (status === "success") {
            timeoutRef.current = window.setTimeout(() => setStatus("idle"), 5000);
        }

        return () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [status]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        form.reset();
        setStatus("success");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
            <Head title="Contacto | FoodMarket" />

            <AppNavbar />

            <main>
                {/* Hero */}
                <section id="soporte" className="bg-orange-50 dark:bg-gray-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-3/5">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                                Estamos aquí para ayudarte en cada pedido.
                            </h1>
                            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
                                Nuestro equipo de soporte está disponible todos los días para garantizar que tu experiencia con FoodMarket sea siempre impecable.
                                Escríbenos, llámanos o agenda una reunión presencial cuando lo necesites.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-6">
                                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <div className="rounded-full bg-white dark:bg-gray-800 p-3 shadow">
                                        <Phone className="h-5 w-5 text-orange-600" />
                                    </div>
                                    Soporte 24/7 para clientes y repartidores
                                </div>
                                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <div className="rounded-full bg-white dark:bg-gray-800 p-3 shadow">
                                        <Clock className="h-5 w-5 text-orange-600" />
                                    </div>
                                    Respuesta promedio menor a 10 minutos
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-2/5 w-full">
                            <Card className="border border-orange-200/50 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-gray-900 dark:text-white">
                                        Escríbenos un mensaje
                                    </CardTitle>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Llena el formulario y uno de nuestros especialistas te contactará en menos de 24 horas.
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    {status === "success" && (
                                        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-700/40 dark:bg-green-500/10 dark:text-green-300">
                                            ¡Gracias por escribirnos! Revisaremos tu mensaje y te responderemos muy pronto.
                                        </div>
                                    )}
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nombre</Label>
                                            <Input id="name" name="name" placeholder="Ingresa tu nombre" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Correo electrónico</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="tucorreo@ejemplo.com"
                                                autoComplete="email"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="topic">Asunto</Label>
                                            <Input id="topic" name="topic" placeholder="¿Cómo podemos ayudarte?" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message">Mensaje</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder="Cuéntanos más detalles para ayudarte mejor"
                                                rows={5}
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600">
                                            <Send className="h-4 w-4 mr-2" /> Enviar mensaje
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Información de contacto */}
                <section className="py-20 bg-white dark:bg-gray-950">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {CONTACT_CHANNELS.map(({ id, title, description, icon: Icon, action, link, display }) => (
                                <Card
                                    key={title}
                                    id={id}
                                    className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                                >
                                    <CardHeader className="space-y-4">
                                        <div className="rounded-full bg-orange-500/10 dark:bg-orange-500/20 w-12 h-12 flex items-center justify-center">
                                            <Icon className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                                        </div>
                                        <CardTitle className="text-xl text-gray-900 dark:text-white">{title}</CardTitle>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <a
                                            href={link}
                                            className="inline-flex items-center text-sm font-semibold text-orange-600 dark:text-orange-400 hover:underline"
                                        >
                                            {action}: {display}
                                        </a>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
                            <Card className="border border-orange-200/60 dark:border-gray-800 bg-orange-50/60 dark:bg-gray-900">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-gray-900 dark:text-white">Horario de atención</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-gray-700 dark:text-gray-300">
                                    <p className="font-semibold">Soporte al cliente</p>
                                    <p>Lunes a domingo · 8:00 a.m. – 11:00 p.m.</p>
                                    <p className="font-semibold mt-6">Equipos de logística</p>
                                    <p>Seguimiento de pedidos urgentes · 24/7</p>
                                </CardContent>
                            </Card>
                            <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-gray-900 dark:text-white">Cobertura actual</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
                                    <p>
                                        Operamos en Area Metropolitana de San Salvador y sus alrededores. Estamos preparando nuevas rutas en otros departamentos de El salvador para llegar aún más lejos.
                                    </p>
                                    <p>
                                        ¿Tu restaurante está fuera de estas zonas? Escríbenos para evaluar la apertura de tu mercado.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>

            <AppFooter />
        </div>
    );
}
