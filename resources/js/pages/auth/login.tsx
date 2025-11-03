import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import AppFooter from '@/components/app-footer';
import AppNavbar from '@/components/app-navbar';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { ChefHat, Clock, LoaderCircle, ShieldCheck } from 'lucide-react';
import { useCartToken } from '@/hooks/use-cart-token';

interface LoginProps {
    status?: string;
    notice?: string;
    canResetPassword: boolean;
}

export default function Login({ status, notice, canResetPassword }: LoginProps) {
    const sessionToken = useCartToken();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
            <Head title="Iniciar sesión | FoodMarket" />

            <AppNavbar />

            <main className="pb-20 pt-16">
                <div className="container mx-auto flex flex-col gap-16 px-4 sm:px-6 lg:flex-row lg:items-center lg:gap-20">
                    <div className="lg:w-1/2 space-y-7">
                        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 w-fit">
                            Bienvenido de vuelta
                        </Badge>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                            Conecta con tus sabores favoritos en segundos.
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Inicia sesión para retomar tus pedidos, descubrir nuevas promociones y seguir disfrutando del marketplace gastronómico que impulsa a la escena local.
                        </p>

                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <span className="rounded-full bg-orange-100 dark:bg-orange-500/20 p-2">
                                    <ChefHat className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                                </span>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Menús curados para ti</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Recomendaciones personalizadas según tus pedidos y favoritos.
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="rounded-full bg-orange-100 dark:bg-orange-500/20 p-2">
                                    <Clock className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                                </span>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Entrega rápida y confiable</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Seguimiento en tiempo real para que sepas cuándo llega tu comida.
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="rounded-full bg-orange-100 dark:bg-orange-500/20 p-2">
                                    <ShieldCheck className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                                </span>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Pagos seguros</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Tus métodos de pago favoritos protegidos de extremo a extremo.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <Card className="w-full lg:w-2/5 border border-orange-200/60 bg-white/90 shadow-2xl backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">
                        <CardHeader className="space-y-3">
                            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Inicia sesión en tu cuenta
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Ingresa tus credenciales para continuar con tu experiencia FoodMarket.
                            </p>
                            {notice && (
                                <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm text-orange-700 dark:border-orange-600/60 dark:bg-orange-500/10 dark:text-orange-300">
                                    {notice}
                                </div>
                            )}
                            {status && (
                                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700 dark:border-green-700/40 dark:bg-green-500/10 dark:text-green-300">
                                    {status}
                                </div>
                            )}
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...AuthenticatedSessionController.store.form()}
                                resetOnSuccess={['password']}
                                className="flex flex-col gap-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <input type="hidden" name="session_token" value={sessionToken ?? ''} />
                                        <div className="grid gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    Correo electrónico
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    placeholder="tucorreo@ejemplo.com"
                                                />
                                                <InputError message={errors.email} />
                                            </div>

                                            <div className="grid gap-2">
                                                <div className="flex items-center">
                                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                        Contraseña
                                                    </Label>
                                                    {canResetPassword && (
                                                        <TextLink
                                                            href={request()}
                                                            className="ml-auto text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400"
                                                            tabIndex={5}
                                                        >
                                                            ¿Olvidaste tu contraseña?
                                                        </TextLink>
                                                    )}
                                                </div>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="••••••••"
                                                />
                                                <InputError message={errors.password} />
                                            </div>

                                            <div className="flex items-center space-x-3 rounded-lg bg-orange-50/60 px-4 py-3 dark:bg-gray-800/60">
                                                <Checkbox id="remember" name="remember" tabIndex={3} />
                                                <Label htmlFor="remember" className="text-sm text-gray-700 dark:text-gray-300">
                                                    Recuérdame en este dispositivo
                                                </Label>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="mt-2 w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
                                            tabIndex={4}
                                            disabled={processing}
                                            data-test="login-button"
                                        >
                                            {processing && (
                                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                            )}
                                            Ingresar
                                        </Button>

                                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                            ¿Aún no tienes cuenta?{' '}
                                            <TextLink
                                                href={register()}
                                                tabIndex={5}
                                                className="font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400"
                                            >
                                                Crear una cuenta
                                            </TextLink>
                                        </p>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <AppFooter />
        </div>
    );
}
