import { Head, Link, usePage, router } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/core';
import { Search, MapPin } from "lucide-react"; 
import { useState } from 'react'; // Importamos useState para el campo de búsqueda

// Importamos los nuevos componentes reutilizables (manteniendo el casing que usaste)
import AppNavbar from '@/components/app-navbar'; 
import AppFooter from '@/components/app-footer'; 

// Componentes UI (simulando Radix UI)
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; 

// --- Tipos de Datos de Explore.tsx ---
type Restaurant = {
  id: number;
  business_name: string;
  logo_url?: string | null;
  phone?: string | null;
  location_city?: string | null; 
  description?: string | null;
};

type Pagination<T> = {
  data: T[];
  links: { url: string | null; label: string; active: boolean }[];
  total: number;
};

interface ExploreProps extends PageProps {
  restaurants: Pagination<Restaurant>;
}
// ------------------------------------------


export default function Explore({ restaurants }: ExploreProps) {
    const { url } = usePage();
    
    // Parseamos la URL actual para obtener los parámetros iniciales
    const currentUrl = new URL(url, window.location.href); 
    const initialSearchQuery = currentUrl.searchParams.get('search') || '';
    const sortBy = currentUrl.searchParams.get('sort') || 'business_name';

    // State para controlar el valor del input de búsqueda
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    
    // Función para obtener la URL de la imagen
    const getImageUrl = (logo_url: string | null | undefined): string => {
        const p = logo_url ?? '';
        if (!p) return '/placeholder.svg';
        if (p.startsWith('http') || p.startsWith('/storage')) return p;
        return `/storage/${p}`;
    };

    // Función para crear el link de ordenamiento (ya funcional)
    const createSortLink = (newSortBy: string) => {
        const params = new URLSearchParams(currentUrl.searchParams.toString());
        params.set('sort', newSortBy);
        // Aseguramos que al cambiar el orden, volvemos a la página 1
        params.set('page', '1'); 
        return `${currentUrl.pathname}?${params.toString()}`;
    };

    // Manejador de la búsqueda (ejecutado al enviar el formulario)
    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Creamos nuevos parámetros manteniendo los existentes
        const params = new URLSearchParams(currentUrl.searchParams.toString());
        
        if (searchQuery) {
            params.set('search', searchQuery);
        } else {
            params.delete('search');
        }
        
        // Reseteamos la paginación a la página 1 en una nueva búsqueda
        params.set('page', '1');
        
        // Ejecutamos Inertia GET para recargar los datos
        router.get(currentUrl.pathname, Object.fromEntries(params.entries()), {
            preserveState: true,
            preserveScroll: true,
        });
    };


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-800 dark:text-gray-200">
            
            <Head title="Explorar Restaurantes | FoodMarket" />

            {/* --- Navbar Reutilizado --- */}
            <AppNavbar />
            
            <main>
                {/* --- SECCIÓN DE FILTROS Y BÚSQUEDA --- */}
                <div className="border-b bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex items-center gap-4 mb-4">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Explorar Restaurantes</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {restaurants.total} restaurantes disponibles
                            </p>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-3">
                            {/* FORMULARIO DE BÚSQUEDA */}
                            <form className="relative md:col-span-3" onSubmit={handleSearchSubmit}>
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                <Input
                                    placeholder="Buscar restaurantes por nombre..."
                                    value={searchQuery} // Ahora controlado por el state
                                    onChange={(e) => setSearchQuery(e.target.value)} // Actualiza el state
                                    className="pl-10 pr-[100px]" // Espacio para el botón de búsqueda
                                />
                                <Button type="submit" className="absolute right-0 top-0 h-full rounded-l-none">
                                    Buscar
                                </Button>
                            </form>
                        </div>

                        {/* OPCIONES DE ORDENAMIENTO (ya funcionales) */}
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Ordenar por:</span>
                            <div className="flex gap-2">
                                {/* Los Links redirigen con el parámetro de sort */}
                                <Link href={createSortLink('rating')} preserveState preserveScroll>
                                    <Button
                                        variant={sortBy === "rating" ? "default" : "outline"}
                                        size="sm"
                                    >
                                        Rating (Asumido)
                                    </Button>
                                </Link>
                                <Link href={createSortLink('deliveryTime')} preserveState preserveScroll>
                                    <Button
                                        variant={sortBy === "deliveryTime" ? "default" : "outline"}
                                        size="sm"
                                    >
                                        Tiempo de Entrega (Asumido)
                                    </Button>
                                </Link>
                                <Link href={createSortLink('business_name')} preserveState preserveScroll>
                                    <Button
                                        variant={sortBy === "business_name" ? "default" : "outline"}
                                        size="sm"
                                    >
                                        Nombre
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RESTAURANT GRID --- */}
                <div className="container mx-auto px-4 py-8">
                    {restaurants.data.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-lg text-gray-500 dark:text-gray-400">No se encontraron restaurantes.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {restaurants.data.map((restaurant) => (
                                <Link key={restaurant.id} href={`/restaurants/${restaurant.id}`} className="block h-full">
                                    <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col dark:bg-gray-900">
                                        <div className="relative h-48">
                                            <img
                                                src={getImageUrl(restaurant.logo_url)}
                                                alt={restaurant.business_name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <CardContent className="p-4 flex-grow flex flex-col">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{restaurant.business_name}</h3>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 flex-grow">
                                                {restaurant.description || "Descubre nuestro menú y ven a probar lo mejor de nuestra cocina. ¡Te esperamos!"}
                                            </p>

                                            <div className="mt-auto">
                                                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{restaurant.location_city || "Ciudad Desconocida"}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-3 pt-3 border-t dark:border-gray-800">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">Teléfono</span>
                                                        <span className="font-medium text-gray-900 dark:text-white">{restaurant.phone || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* --- PAGINACIÓN --- */}
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {restaurants.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                preserveScroll
                                className={`px-3 py-1 rounded border transition-colors ${
                                    link.active 
                                        ? 'bg-orange-600 text-white border-orange-600' 
                                        : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                                } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </main>

            {/* --- Footer Reutilizado --- */}
            <AppFooter />
            {/* ------------------------- */}
        </div>
    );
}