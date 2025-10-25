import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { dashboard, login, register, logout } from '@/routes'; // Asumimos una ruta 'logout'
import { type SharedData } from '@/types'; 
import { ChefHat, Sun, Moon, LogOut, LayoutDashboard, User } from "lucide-react";
// Componentes UI (simulando Radix UI)
import { Button } from "@/components/ui/button"; 

// Asumimos que también tienes componentes DropdownMenu si quieres un menú más complejo
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export default function AppNavbar() {
    const { auth } = usePage<SharedData>().props;
    const userIsLoggedIn = !!auth.user;

    // --- LÓGICA DEL MODO OSCURO (Dark Mode) ---
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
        if (savedTheme === 'dark' || savedTheme === 'light') {
            return savedTheme as 'light' | 'dark';
        }
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        const isDark = theme === 'dark';
        
        root.classList.toggle('dark', isDark);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    };
    // ------------------------------------------

    return (
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                
                {/* Logo/Branding */}
                <Link href="/" className="text-2xl font-extrabold text-orange-600 dark:text-orange-500 flex items-center gap-2">
                    <ChefHat className="h-7 w-7"/> FoodMarket
                </Link>
                
                {/* Links principales de navegación */}
                <nav className="hidden md:flex items-center space-x-6">
                    {/* Botón de Inicio agregado */}
                    <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        Inicio
                    </Link>
                    {/* El link de Restaurantes es el actual, se mantiene 'activo' o resaltado */}
                    <Link href="/restaurants" className="font-semibold text-orange-600 dark:text-orange-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                        Restaurantes
                    </Link>
                    <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        Acerca de
                    </Link>
                    <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        Contacto
                    </Link>
                </nav>

                {/* Auth Links, User Display y Toggle de Tema */}
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

                    {/* Lógica de Autenticación */}
                    {userIsLoggedIn ? (
                        <div className="flex items-center gap-3">
                            {/* Mostrar nombre del usuario */}
                            <span className="text-sm font-medium hidden sm:inline-block text-gray-700 dark:text-gray-300">
                                Hola, {auth.user?.name.split(' ')[0] || 'Usuario'}!
                            </span>
                            
                            {/* Botón para Dashboard/Perfil */}
                            <Link href={dashboard()}>
                                <Button variant="outline" size="sm" className="text-sm font-semibold border-orange-600 text-orange-600 hover:bg-orange-50 dark:border-orange-500 dark:text-orange-500 dark:hover:bg-gray-800">
                                    <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                                </Button>
                            </Link>

                            {/* Botón de Logout (esencial para usuario logeado) */}
                            <Link href={logout()} method="post" as="button">
                                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500">
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    ) : (
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
    );
}