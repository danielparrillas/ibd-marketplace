import { useState, useEffect } from 'react';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

// Componentes UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Users, TrendingUp, MapPin } from "lucide-react"; // Solo se mantienen los iconos usados en el cuerpo

// Importamos los componentes reutilizables (Asegúrate que las rutas sean correctas)
import AppNavbar from '@/components/app-navbar'; 
import AppFooter from '@/components/app-footer'; 

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
  count_restautants: number;
  count_customers: number;
  count_orders: number;
}
// ---------------------------------------------

export default function Welcome({ featuredRestaurants, ourSuccess }: { featuredRestaurants: FeaturedRestaurant[]; ourSuccess?: OurSuccess | null }) {
  // Eliminamos la lógica de useState/useEffect para el tema, ya que AppNavbar la manejará.
  const { auth } = usePage<SharedData>().props;

  // Formateo y valores por defecto para la sección "Nuestro Éxito"
  const counts = {
    restaurants: ourSuccess?.count_restautants ?? 0,
    customers: ourSuccess?.count_customers ?? 0,
    orders: ourSuccess?.count_orders ?? 0,
  };

  // Función para obtener la URL del logo
  const getImageUrl = (logo_url: string | null): string => {
    const p = logo_url ?? '';
    if (!p) return '/placeholder.svg';
    if (p.startsWith('http') || p.startsWith('/storage')) return p;
    return `/storage/${p}`;
  };

  return (
    // Se asume que AppNavbar aplica el dark/light mode al <html>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-800 dark:text-gray-200">
      
      <Head title="Bienvenida | FoodMarket" />

      {/* 1. Navbar Reutilizado (Sustituye al Header en línea y la lógica de tema) */}
      <AppNavbar />

      <main>
        {/* Sección Héroe (Hero) */}
        <section className="bg-orange-50 dark:bg-gray-900 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Tu <span className="text-orange-600">comida</span> favorita, entregada rápido.
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-400">
                Pide en cientos de restaurantes locales y recibe deliciosas comidas directamente en tu puerta. Fresco, rápido y fácil.
              </p>
              
              {/*
                2. CUADRO DE BÚSQUEDA FUNCIONAL:
                - Envuelto en <form> con method="GET" y action="/restaurants" (o tu ruta de explorar).
                - El input clave debe tener name="search".
                - El botón es type="submit".
              */}
              <form action="/restaurants" method="GET" className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex items-center bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg min-w-80 border dark:border-gray-700">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Buscar por restaurante o tipo de comida..."
                    name="search" // <--- ¡Esto hace que funcione la búsqueda!
                    className="flex-1 outline-none text-gray-700 dark:text-gray-300 bg-transparent"
                  />
                </div>
                <Button type="submit" size="lg" className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 px-8">
                  Buscar Restaurantes
                </Button>
              </form>

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
                        src={getImageUrl(restaurant.logo_url)}
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
                    <Link href={`/restaurants/${restaurant.restaurant_id}`}>
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

      {/* 3. Footer Reutilizado (Sustituye al Footer en línea) */}
      <AppFooter />
      
    </div>
  );
}