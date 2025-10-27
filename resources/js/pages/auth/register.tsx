import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import AppFooter from '@/components/app-footer';
import AppNavbar from '@/components/app-navbar';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { Building2, LoaderCircle, Sparkles, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
    const [userType, setUserType] = useState('');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
            <Head title="Crear cuenta | FoodMarket" />

            <AppNavbar />

            <main className="pb-20 pt-16">
                <div className="container mx-auto flex flex-col gap-16 px-4 sm:px-6 lg:flex-row lg:items-start lg:gap-20">
                    <div className="lg:w-1/2 space-y-7">
                        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 w-fit">
                            Únete a FoodMarket
                        </Badge>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                            Crea tu cuenta y haz despegar tu experiencia gastronómica.
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Regístrate como cliente o restaurante para aprovechar promociones exclusivas, análisis en tiempo real y herramientas pensadas para el éxito culinario.
                        </p>

                        <div className="grid gap-6 md:grid-cols-2">
                            {[{
                                icon: Sparkles,
                                title: 'Beneficios personalizados',
                                description: 'Programas de fidelidad y recompensas a tu medida.',
                            },
                            {
                                icon: TrendingUp,
                                title: 'Impulso a tus ventas',
                                description: 'Campañas segmentadas y visibilidad frente a nuevos clientes.',
                            },
                            {
                                icon: Building2,
                                title: 'Herramientas para restaurantes',
                                description: 'Gestión de menús, combos y reportes desde un mismo panel.',
                            }].map(({ icon: Icon, title, description }) => (
                                <div key={title} className="flex gap-3 rounded-xl border border-orange-200/50 bg-white/70 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
                                    <span className="rounded-full bg-orange-100 dark:bg-orange-500/20 p-2">
                                        <Icon className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                                    </span>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {title}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Card className="w-full lg:w-2/5 border border-orange-200/60 bg-white/95 shadow-2xl backdrop-blur dark:border-gray-800 dark:bg-gray-900/95">
                        <CardHeader className="space-y-3">
                            <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Registra tu cuenta FoodMarket
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Selecciona el tipo de cuenta y completa la información requerida para comenzar.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...RegisteredUserController.store.form()}
                                resetOnSuccess={['password', 'password_confirmation']}
                                disableWhileProcessing
                                className="flex flex-col gap-6"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="user_type" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    Tipo de cuenta
                                                </Label>
                                                <select
                                                    id="user_type"
                                                    name="user_type"
                                                    value={userType}
                                                    required
                                                    tabIndex={1}
                                                    onChange={(event) => setUserType(event.target.value)}
                                                    className="flex h-11 w-full rounded-md border border-orange-200 bg-white px-3 text-sm text-gray-700 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                                                >
                                                    <option value="">Selecciona una opción</option>
                                                    <option value="customer">Cliente</option>
                                                    <option value="restaurant">Restaurante</option>
                                                </select>
                                                <InputError message={errors.user_type} />
                                            </div>

                                            {userType && (
                                                <>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                            Correo electrónico
                                                        </Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            required
                                                            tabIndex={2}
                                                            autoComplete="email"
                                                            name="email"
                                                            placeholder="tucorreo@ejemplo.com"
                                                        />
                                                        <InputError message={errors.email} />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                            Contraseña
                                                        </Label>
                                                        <Input
                                                            id="password"
                                                            type="password"
                                                            required
                                                            tabIndex={3}
                                                            autoComplete="new-password"
                                                            name="password"
                                                            placeholder="••••••••"
                                                        />
                                                        <InputError message={errors.password} />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                            Confirmar contraseña
                                                        </Label>
                                                        <Input
                                                            id="password_confirmation"
                                                            type="password"
                                                            required
                                                            tabIndex={4}
                                                            autoComplete="new-password"
                                                            name="password_confirmation"
                                                            placeholder="Repite tu contraseña"
                                                        />
                                                        <InputError message={errors.password_confirmation} />
                                                    </div>
                                                </>
                                            )}

                                            {userType === 'customer' && (
                                                <>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="first_name" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                            Nombres
                                                        </Label>
                                                        <Input
                                                            id="first_name"
                                                            type="text"
                                                            required
                                                            tabIndex={5}
                                                            name="first_name"
                                                            placeholder="Tus nombres"
                                                        />
                                                        <InputError message={errors.first_name} />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="last_name" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                            Apellidos
                                                        </Label>
                                                        <Input
                                                            id="last_name"
                                                            type="text"
                                                            required
                                                            tabIndex={6}
                                                            name="last_name"
                                                            placeholder="Tus apellidos"
                                                        />
                                                        <InputError message={errors.last_name} />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                            Teléfono
                                                        </Label>
                                                        <Input
                                                            id="phone"
                                                            type="text"
                                                            tabIndex={7}
                                                            name="phone"
                                                            placeholder="Número de contacto"
                                                        />
                                                        <InputError message={errors.phone} />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="birth_date" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                            Fecha de nacimiento
                                                        </Label>
                                                        <Input
                                                            id="birth_date"
                                                            type="date"
                                                            tabIndex={8}
                                                            name="birth_date"
                                                        />
                                                        <InputError message={errors.birth_date} />
                                                    </div>
                                                </>
                                            )}

                                            {userType === 'restaurant' && (
                                                <>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="business_name" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                            Nombre comercial del restaurante
                                                        </Label>
                                                        <Input
                                                            id="business_name"
                                                            type="text"
                                                            required
                                                            tabIndex={5}
                                                            name="business_name"
                                                            placeholder="Nombre comercial"
                                                        />
                                                        <InputError message={errors.business_name} />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="responsible_name" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                            Nombre del responsable
                                                        </Label>
                                                        <Input
                                                            id="responsible_name"
                                                            type="text"
                                                            required
                                                            tabIndex={12}
                                                            name="responsible_name"
                                                            placeholder="Persona de contacto"
                                                        />
                                                        <InputError message={errors.responsible_name} />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="legal_name" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                            Razón social
                                                        </Label>
                                                        <Input
                                                            id="legal_name"
                                                            type="text"
                                                            tabIndex={6}
                                                            name="legal_name"
                                                            placeholder="Razón social"
                                                        />
                                                        <InputError message={errors.legal_name} />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                            Teléfono de contacto
                                                        </Label>
                                                        <Input
                                                            id="phone"
                                                            type="text"
                                                            required
                                                            tabIndex={7}
                                                            name="phone"
                                                            placeholder="Teléfono principal"
                                                        />
                                                        <InputError message={errors.phone} />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="legal_document" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                            Documento legal
                                                        </Label>
                                                        <Input
                                                            id="legal_document"
                                                            type="text"
                                                            tabIndex={8}
                                                            name="legal_document"
                                                            placeholder="NIT, RFC, etc."
                                                        />
                                                        <InputError message={errors.legal_document} />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="business_license" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                            Licencia comercial
                                                        </Label>
                                                        <Input
                                                            id="business_license"
                                                            type="text"
                                                            tabIndex={9}
                                                            name="business_license"
                                                            placeholder="Número de licencia"
                                                        />
                                                        <InputError message={errors.business_license} />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                            Descripción del restaurante
                                                        </Label>
                                                        <Input
                                                            id="description"
                                                            type="text"
                                                            tabIndex={10}
                                                            name="description"
                                                            placeholder="Especialidad, estilo o valores"
                                                        />
                                                        <InputError message={errors.description} />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label htmlFor="logo_url" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                            URL del logotipo
                                                        </Label>
                                                        <Input
                                                            id="logo_url"
                                                            type="text"
                                                            tabIndex={11}
                                                            name="logo_url"
                                                            placeholder="https://..."
                                                        />
                                                        <InputError message={errors.logo_url} />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {userType && (
                                            <Button
                                                type="submit"
                                                className="mt-2 w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
                                                tabIndex={13}
                                                data-test="register-user-button"
                                                disabled={processing}
                                            >
                                                {processing && (
                                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                                )}
                                                Crear cuenta
                                            </Button>
                                        )}

                                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                            ¿Ya tienes cuenta?{' '}
                                            <TextLink
                                                href={login()}
                                                tabIndex={13}
                                                className="font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400"
                                            >
                                                Inicia sesión
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
