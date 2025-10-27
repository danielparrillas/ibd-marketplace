import { Link } from '@inertiajs/react';
import { ChefHat } from "lucide-react"; 
import React from 'react';

export default function AppFooter() {
    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Columna 1: Branding */}
                    <div>
                    <h5 className="font-extrabold text-2xl mb-4 text-orange-500 flex items-center gap-2">
                        <ChefHat className="h-6 w-6"/> FoodMarket
                    </h5>
                    <p className="text-gray-400 text-sm">Comida deliciosa entregada a tu puerta.</p>
                    </div>
                    
                    {/* Columna 2: Cliente */}
                    <div>
                    <h5 className="font-semibold mb-4">Cliente</h5>
                    <ul className="space-y-2 text-gray-400">
                        <li>
                        <Link href="/contact#soporte" className="hover:text-white transition-colors">
                            Centro de Ayuda
                        </Link>
                        </li>
                        <li>
                        <Link href="/settings/profile" className="hover:text-white transition-colors">
                            Tu Cuenta
                        </Link>
                        </li>
                        <li>
                        <Link href="/cart" className="hover:text-white transition-colors">
                            Rastrear Pedido
                        </Link>
                        </li>
                    </ul>
                    </div>
                    
                    {/* Columna 3: Socios */}
                    <div>
                    <h5 className="font-semibold mb-4">Socios</h5>
                    <ul className="space-y-2 text-gray-400">
                        <li>
                        <Link href="/register" className="hover:text-white transition-colors">
                            Registrar Restaurante
                        </Link>
                        </li>
                        <li>
                        <Link href="/dashboard" className="hover:text-white transition-colors">
                            Panel de Restaurante
                        </Link>
                        </li>
                        <li>
                        <Link href="/contact#partners" className="hover:text-white transition-colors">
                            Soporte a Socios
                        </Link>
                        </li>
                    </ul>
                    </div>
                    
                    {/* Columna 4: Compañía */}
                    <div>
                    <h5 className="font-semibold mb-4">Compañía</h5>
                    <ul className="space-y-2 text-gray-400">
                        <li>
                        <Link href="/about" className="hover:text-white transition-colors">
                            Acerca de Nosotros
                        </Link>
                        </li>
                        <li>
                        <Link href="/about#careers" className="hover:text-white transition-colors">
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
                
                {/* Derechos de Autor */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} FoodMarket. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}