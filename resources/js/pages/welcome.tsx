import { useState, useEffect } from 'react';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

// Componentes UI (simulando Radix UI vía Shadcn/ui)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, ChefHat, Users, TrendingUp, Sun, Moon } from "lucide-react";

// Tipado de restaurantes destacados provenientes del backend (vista top_restaurant)
interface FeaturedRestaurant {
  restaurant_id: number;
  business_name: string;
  legal_name: string | null;
  phone: string | null;
  logo_url: string | null;
  Orders_Count: number;
}
// Tipado de métricas "Nuestro Éxito"
interface OurSuccess {
  count_restautants: number; // nombre de columna según la consulta proporcionada
  count_customers: number;
  count_orders: number;
}
// ---------------------------------------------

export default function Welcome({ featuredRestaurants, ourSuccess }: { featuredRestaurants: FeaturedRestaurant[]; ourSuccess?: OurSuccess | null }) {
  const { auth } = usePage<SharedData>().props;

  // --- LÓGICA DEL MODO OSCURO (Dark Mode) ---
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // 1. Verificar localStorage para el tema guardado
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme as 'light' | 'dark';
    }
    // 2. Verificar la preferencia del sistema operativo
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    // Agrega o quita la clase 'dark' al elemento HTML para activar Tailwind Dark Mode
    const isDark = theme === 'dark';
    
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  };
  // ------------------------------------------

  // Formateo y valores por defecto para la sección "Nuestro Éxito"
  const counts = {
    restaurants: ourSuccess?.count_restautants ?? 0,
    customers: ourSuccess?.count_customers ?? 0,
    orders: ourSuccess?.count_orders ?? 0,
  };

  return (
    // Se han aplicado clases dark: de welcome_en.tsx
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-800 dark:text-gray-200">
      
      <Head title="Bienvenida | FoodMarket" />

      {/* Header/Navigation - Adaptado con Auth, Botones y Toggle de Tema */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              {/* Logo/Branding */}
              <Link href="/" className="text-2xl font-extrabold text-orange-600 dark:text-orange-500 flex items-center gap-2">
                  <ChefHat className="h-7 w-7"/> FoodMarket
              </Link>
              
              {/* Links principales de navegación */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/restaurants" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Restaurantes
                </Link>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Acerca de
                </Link>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Contacto
                </Link>
              </nav>

              {/* Auth Links y Toggle de Tema */}
              <nav className="flex items-center gap-2">
                  {/* Botón de Modo Oscuro/Claro */}
                  <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={toggleTheme}
                      className="text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                      aria-label="Alternar modo oscuro"
                  >
                      {theme === 'light' ? (
                          <Moon className="h-5 w-5" />
                      ) : (
                          <Sun className="h-5 w-5" />
                      )}
                  </Button>

                  {/* Lógica de Autenticación Corregida */}
                  {auth.user ? (
                      <Link href={dashboard()}>
                          <Button variant="outline" className="text-sm font-semibold border-orange-600 text-orange-600 hover:bg-orange-50 dark:border-orange-500 dark:text-orange-500 dark:hover:bg-gray-800">
                              Panel de Control
                          </Button>
                      </Link>
                  ) : (
                      // Se envuelve en un div para evitar el error de React.Children.only
                      <div className="flex items-center gap-2">
                          <Link href={login()}>
                              <Button variant="ghost" className="text-sm font-semibold hover:bg-orange-100 dark:hover:bg-gray-800">Iniciar Sesión</Button>
                          </Link>
                          <Link href={register()}>
                              <Button className="text-sm font-semibold bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600">Regístrate</Button>
                          </Link>
                      </div>
                  )}
              </nav>
          </div>
      </header>

      <main>
        {/* Sección Héroe (Hero) - Estilo de welcome_en.tsx con traducción */}
        <section className="bg-orange-50 dark:bg-gray-900 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Tu <span className="text-orange-600">comida</span> favorita, entregada rápido.
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-400">
                Pide en cientos de restaurantes locales y recibe deliciosas comidas directamente en tu puerta. Fresco, rápido y fácil.
              </p>
              
              {/* Búsqueda/Ubicación - Adaptado de welcome_visual.tsx */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg min-w-80 border dark:border-gray-700">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Ingresa tu dirección de entrega"
                    className="flex-1 outline-none text-gray-700 dark:text-gray-300 bg-transparent"
                  />
                </div>
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 px-8">
                  Buscar Restaurantes
                </Button>
              </div>

              <div className="mt-8 flex space-x-4">
                <Link href={register()}>
                    <Button size="lg" className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-lg shadow-xl shadow-orange-200/50">
                        Ordenar Ahora
                    </Button>
                </Link>
                <Link href="/restaurants">
                    <Button size="lg" variant="outline" className="text-lg border-2 border-orange-600 text-orange-600 hover:bg-orange-50 dark:border-orange-500 dark:text-orange-500 dark:hover:bg-gray-800">
                        Explorar Restaurantes
                    </Button>
                </Link>
              </div>
            </div>
            
            {/* Imagen del héroe */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="w-full max-w-lg h-80 bg-gray-200 dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                <img
                  src="/storage/welcome/food_market_3.png"
                  alt="Comida deliciosa - FoodMarket"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Restaurantes Destacados (Featured Restaurants) */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">Restaurantes Destacados</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {(featuredRestaurants || []).map((restaurant) => (
                <Card key={restaurant.restaurant_id} className="w-full sm:w-[340px] overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-900 border dark:border-gray-800">
                  <div className="h-48 w-full bg-orange-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                    <img
                        src={(() => {
                          const p = restaurant.logo_url;
                          if (!p) return "/placeholder.svg";
                          if (p.startsWith("http") || p.startsWith("/storage")) return p;
                          return `/storage/${p}`;
                        })()}
                        alt={restaurant.business_name}
                        className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-gray-900 dark:text-white">{restaurant.business_name}</CardTitle>
                      <Badge className="bg-orange-600 hover:bg-orange-700">Top</Badge>
                    </div>
                    {restaurant.legal_name && (
                      <CardDescription className="text-orange-600 font-medium">{restaurant.legal_name}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm">
                      <TrendingUp className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                      <span>{restaurant.Orders_Count} pedidos</span>
                    </div>
                    <Link href={`/restaurant/${restaurant.restaurant_id}`}>
                        <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600">Ver Menú</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Sección de Estadísticas (Stats) cargada desde BD */}
        <section className="py-16 bg-orange-600 dark:bg-gray-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Nuestro Éxito en Números</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6 bg-orange-700/80 dark:bg-gray-700/80 rounded-lg shadow-xl">
                <ChefHat className="w-10 h-10 mx-auto mb-4 text-white" />
                <p className="text-4xl font-extrabold">{counts.restaurants.toLocaleString()}</p>
                <p className="mt-2 text-lg font-semibold">Restaurantes</p>
              </div>
              <div className="p-6 bg-orange-700/80 dark:bg-gray-700/80 rounded-lg shadow-xl">
                <Users className="w-10 h-10 mx-auto mb-4 text-white" />
                <p className="text-4xl font-extrabold">{counts.customers.toLocaleString()}</p>
                <p className="mt-2 text-lg font-semibold">Clientes Felices</p>
              </div>
              <div className="p-6 bg-orange-700/80 dark:bg-gray-700/80 rounded-lg shadow-xl">
                <TrendingUp className="w-10 h-10 mx-auto mb-4 text-white" />
                <p className="text-4xl font-extrabold">{counts.orders.toLocaleString()}</p>
                <p className="mt-2 text-lg font-semibold">Pedidos Entregados</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA - Únete como Socio */}
        <section className="py-20 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">Conviértete en Socio de FoodMarket</h2>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Llega a miles de nuevos clientes. ¡Únete a nuestra red hoy!</p>
                <div className="mt-8">                   
                    <Link href={register()}>
                        <Button size="lg" className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-lg shadow-xl shadow-green-200/50">
                            Registra tu Restaurante
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
      </main>

      {/* Pie de Página (Footer) - Estilo de welcome_en.tsx con traducción */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-extrabold text-2xl mb-4 text-orange-500">FoodMarket</h5>
              <p className="text-gray-400 text-sm">Comida deliciosa entregada a tu puerta.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Cliente</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Centro de Ayuda
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="hover:text-white transition-colors">
                    Tu Cuenta
                  </Link>
                </li>
                <li>
                  <Link href="/track-order" className="hover:text-white transition-colors">
                    Rastrear Pedido
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Socios</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/restaurant/signup" className="hover:text-white transition-colors">
                    Registrar Restaurante
                  </Link>
                </li>
                <li>
                  <Link href="/restaurant/dashboard" className="hover:text-white transition-colors">
                    Panel de Restaurante
                  </Link>
                </li>
                <li>
                  <Link href="/restaurant/support" className="hover:text-white transition-colors">
                    Soporte a Socios
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Compañía</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Acerca de Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Carreras
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} FoodMarket. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}