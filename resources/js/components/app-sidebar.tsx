import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import ingredients from '@/routes/ingredients';
import profile from '@/routes/restaurant/profile';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    HandPlatter,
    LayoutGrid,
    ShoppingBasket,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];



export function AppSidebar() {
    const userType = usePage<SharedData>().props.auth.user.user_type;

    // Agregar ingredientes al menú principal solo para restaurantes
    const navItems = [...mainNavItems];
    if (userType === 'restaurant') {
        navItems.push({
            title: 'Ingredientes',
            href: ingredients.index(),
            icon: ShoppingBasket,
        });
        navItems.push({
            title: 'Platillos',
            href: ingredients.index().url.replace('ingredients', 'dishes'),
            icon: HandPlatter,
        });
    }
//Menu de perfil de restaurante en el sidebar
const footerNavItems: NavItem[] =
  userType === 'restaurant'
    ? [
        {
          title: 'My restaurant',
          href: profile.edit(),
          icon: Building2,
        },
      ]
    : [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
