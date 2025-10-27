import { Head, Link } from "@inertiajs/react";
import AppNavbar from "@/components/app-navbar";
import AppFooter from "@/components/app-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Target,
    Leaf,
    Users,
    Truck,
    Handshake,
    Heart,
    Building2,
    Sparkles,
    type LucideIcon,
} from "lucide-react";

interface ValueItem {
    title: string;
    description: string;
    icon: LucideIcon;
}

interface MilestoneItem {
    year: string;
    title: string;
    description: string;
}

const VALUES: ValueItem[] = [
    {
        title: "Pasión por el sabor",
        description:
            "Trabajamos con restaurantes locales para ofrecer experiencias culinarias auténticas y memorables.",
        icon: Sparkles,
    },
    {
        title: "Impacto sostenible",
        description:
            "Optimizamos rutas y empaques para reducir la huella ambiental sin comprometer la frescura.",
        icon: Leaf,
    },
    {
        title: "Comunidad primero",
        description:
            "Creamos alianzas con negocios independientes y apoyamos programas sociales en cada ciudad.",
        icon: Handshake,
    },
    {
        title: "Tecnología humana",
        description:
            "Desarrollamos soluciones que conectan logística inteligente con un servicio cercano y empático.",
        icon: Target,
    },
];

const MILESTONES: MilestoneItem[] = [
    {
        year: "2018",
        title: "El inicio",
        description:
            "Comenzamos como un proyecto universitario conectando a estudiantes con restaurantes de barrio en Lima.",
    },
    {
        year: "2020",
        title: "Expansión regional",
        description:
            "Nos aliamos con más de 150 restaurantes y lanzamos la primera versión de nuestra app multiplataforma.",
    },
    {
        year: "2023",
        title: "Logística inteligente",
        description:
            "Integramos rutas dinámicas y analítica en tiempo real para acelerar las entregas en hora pico.",
    },
    {
        year: "2025",
        title: "Marketplace integral",
        description:
            "Abrimos nuestra plataforma a productores locales y chefs independientes para ampliar la oferta gastronómica.",
    },
];

const IMPACT_METRICS = [
    {
        label: "Restaurantes aliados",
        value: "320+",
        icon: Building2,
    },
    {
        label: "Pedidos entregados",
        value: "1.2M",
        icon: Truck,
    },
    {
        label: "Clientes felices",
        value: "850K",
        icon: Users,
    },
    {
        label: "Programas sociales",
        value: "45",
        icon: Heart,
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
            <Head title="Acerca de | FoodMarket" />

            <AppNavbar />

            <main>
                {/* Hero */}
                <section className="bg-white dark:bg-gray-950">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row items-center gap-12">
                        <div className="lg:w-1/2">
                            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 mb-6">
                                Nuestra historia
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                                Llevamos la comida que amas a la comunidad que construimos.
                            </h1>
                            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
                                FoodMarket nació con el propósito de conectar a las personas con los sabores locales que las representan.
                                Creemos en el poder de la tecnología para acercar a los restaurantes independientes, productores artesanales
                                y comensales curiosos en una experiencia justa, segura y deliciosa.
                            </p>
                        </div>
                        <div className="lg:w-1/2 grid grid-cols-2 gap-6">
                            {IMPACT_METRICS.map(({ label, value, icon: Icon }) => (
                                <Card key={label} className="bg-orange-50/60 dark:bg-gray-900 border-none shadow-md">
                                    <CardHeader className="flex flex-col items-start space-y-3">
                                        <div className="rounded-full bg-orange-100 dark:bg-orange-500/20 p-3">
                                            <Icon className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                                        </div>
                                        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {value}
                                        </CardTitle>
                                        <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                            {label}
                                        </p>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Valores */}
                <section className="py-20 bg-orange-600/5 dark:bg-gray-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                Una cultura enfocada en las personas
                            </h2>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                                Nuestro equipo combina talento culinario, diseño de servicio y ciencia de datos para crear experiencias
                                culinarias impecables en cada entrega.
                            </p>
                        </div>

                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {VALUES.map(({ title, description, icon: Icon }) => (
                                <Card key={title} className="border border-orange-200/40 dark:border-gray-800 bg-white dark:bg-gray-950">
                                    <CardHeader className="flex items-center gap-4">
                                        <div className="rounded-full bg-orange-500/10 dark:bg-orange-500/20 p-3">
                                            <Icon className="h-6 w-6 text-orange-500" />
                                        </div>
                                        <CardTitle className="text-xl text-gray-900 dark:text-white">{title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 dark:text-gray-400">{description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Línea de tiempo */}
                <section className="py-20 bg-white dark:bg-gray-950">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                Nuestra evolución
                            </h2>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                                Innovamos constantemente para poner la logística, la gastronomía y la hospitalidad al servicio de cada pedido.
                            </p>
                        </div>

                        <div className="mt-16 relative">
                            <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-gradient-to-b from-orange-200 via-orange-400 to-orange-600 dark:from-gray-700 dark:via-gray-600 dark:to-orange-500" />
                            <div className="space-y-16">
                                {MILESTONES.map(({ year, title, description }, index) => (
                                    <div
                                        key={`${year}-${title}`}
                                        className={`relative flex flex-col lg:flex-row ${
                                            index % 2 === 0 ? "lg:justify-start" : "lg:justify-end"
                                        }`}
                                    >
                                        <div className="lg:w-1/2 lg:px-10">
                                            <Card className="border border-orange-200/50 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
                                                <CardHeader>
                                                    <Badge className="w-fit bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">
                                                        {year}
                                                    </Badge>
                                                    <CardTitle className="mt-4 text-2xl text-gray-900 dark:text-white">
                                                        {title}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-gray-600 dark:text-gray-400">{description}</p>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Carreras */}
                <section id="careers" className="py-20 bg-orange-600/10 dark:bg-gray-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-2 items-center">
                        <div>
                            <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 mb-4">
                                Oportunidades laborales
                            </Badge>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                Construye el futuro del delivery con nosotros
                            </h2>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                                Buscamos talento en operaciones, ingeniería, producto y atención al cliente para acelerar nuestra expansión en toda la región.
                                Valoramos la curiosidad, la colaboración y las ganas de generar impacto positivo en los barrios a los que servimos.
                            </p>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                                Comparte tu CV y cuéntanos cómo te gustaría aportar a FoodMarket. Respondemos a cada candidatura en menos de una semana.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-4">
                                <Link
                                    href="mailto:talento@foodmarket.com"
                                    className="inline-flex items-center justify-center rounded-full bg-orange-600 px-8 py-3 text-base font-semibold text-white shadow-md hover:bg-orange-700 transition"
                                >
                                    Enviar CV
                                </Link>
                                <Link
                                    href="/contact#soporte"
                                    className="inline-flex items-center justify-center rounded-full border border-orange-600 px-8 py-3 text-base font-semibold text-orange-600 hover:bg-orange-50 dark:border-orange-500 dark:text-orange-300 dark:hover:bg-gray-800 transition"
                                >
                                    Conversar con talento humano
                                </Link>
                            </div>
                        </div>
                        <Card className="border border-orange-200/60 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-2xl text-gray-900 dark:text-white">Áreas en crecimiento</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
                                <p className="font-semibold">Tecnología</p>
                                <p>Backend con Laravel, frontend con React + Inertia y analítica avanzada para optimizar rutas.</p>
                                <p className="font-semibold">Operaciones</p>
                                <p>Coordinación logística, calidad de servicio y expansión a nuevas ciudades.</p>
                                <p className="font-semibold">Experiencia del cliente</p>
                                <p>Diseño de producto, marketing de fidelización y soporte omnicanal.</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 bg-orange-600 text-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <Badge className="bg-white/10 text-white border-white/20">Crece con nosotros</Badge>
                        <h2 className="mt-6 text-4xl md:text-5xl font-extrabold">
                            ¿Listo para llevar tu restaurante al siguiente nivel?
                        </h2>
                        <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-orange-100">
                            Únete a FoodMarket y descubre cómo podemos impulsar tus ventas con entregas confiables, marketing segmentado
                            y análisis accionables.
                        </p>
                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-semibold text-orange-600 shadow-md hover:bg-orange-50 transition"
                            >
                                Abrir una cuenta para restaurantes
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center rounded-full border border-white px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition"
                            >
                                Hablar con nuestro equipo
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <AppFooter />
        </div>
    );
}
