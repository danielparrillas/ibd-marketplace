import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit as editPassword } from '@/routes/password';
import { edit } from '@/routes/profile'; // para login info
import profile from '@/routes/restaurant/profile'; // ruta de restaurante
import customerProfile from '@/routes/customer/profile'; // ruta de cliente
import { type NavItem,  type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function SettingsLayout({ children }: PropsWithChildren) {
  // Obtener userType de Inertia
  const userType = usePage<SharedData>().props.auth.user.user_type;

  // Evitar render server-side
  if (typeof window === 'undefined') {
    return null;
  }

  // Configurar sidebarNavItems con link condicional según userType
  const sidebarNavItems: NavItem[] = [
    {
      title: 'Informacion de inicio de sesion',
      href: edit(),
      icon: null,
    },
    {
      title: 'Informacion del perfil',
      href:
        userType === 'restaurant'
          ? profile.edit()
          : userType === 'customer'
          ? customerProfile.edit()
          : '#', // fallback si no hay userType
      icon: null,
    },
    {
      title: 'Cambio de contraseña',
      href: editPassword(),
      icon: null,
    },
    {
      title: 'Tema',
      href: editAppearance(),
      icon: null,
    },
  ];

  const currentPath = window.location.pathname;

  return (
    <div className="px-4 py-6">
      <Heading
        title="Configuración"
        description="Administra la configuración de tu perfil y cuenta"
      />

      <div className="flex flex-col lg:flex-row lg:space-x-12">
        <aside className="w-full max-w-xl lg:w-48">
          <nav className="flex flex-col space-y-1 space-x-0">
            {sidebarNavItems.map((item, index) => (
              <Button
                key={`${
                  typeof item.href === 'string' ? item.href : item.href.url
                }-${index}`}
                size="sm"
                variant="ghost"
                asChild
                className={cn('w-full justify-start', {
                  'bg-muted':
                    currentPath ===
                    (typeof item.href === 'string' ? item.href : item.href.url),
                })}
              >
                <Link href={item.href}>
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </aside>

        <Separator className="my-6 lg:hidden" />

        <div className="flex-1 md:max-w-2xl">
          <section className="max-w-xl space-y-12">{children}</section>
        </div>
      </div>
    </div>
  );
}
