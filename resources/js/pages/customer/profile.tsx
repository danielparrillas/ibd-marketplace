import { Form, Head, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { type BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import edit from '@/routes/customer';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Perfil del Cliente',
    href: edit.profile.edit().url,
  },
];

export default function CustomerProfile() {
  interface Customer {
    first_name: string;
    last_name: string;
    phone?: string;
    birth_date?: string;
  }

const { customer } = usePage<{ customer: Customer }>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Perfil del Cliente" />
      <SettingsLayout>
        <div className="container mx-auto px-4 space-y-6">
          <HeadingSmall
            title="Información del Cliente"
            description="Actualiza los datos de tu perfil como cliente."
          />

          <Form
            method="put"
            action="/customer/profile"
            className="space-y-6"
            options={{
              preserveScroll: true,
            }}
          >
            {({ processing, recentlySuccessful, errors }) => (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="first_name">Nombre</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    defaultValue={customer.first_name}
                    required
                    placeholder="Tu nombre"
                  />
                  <InputError message={errors.first_name} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="last_name">Apellido</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    defaultValue={customer.last_name}
                    required
                    placeholder="Tu apellido"
                  />
                  <InputError message={errors.last_name} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={customer.phone}
                    placeholder="Número de teléfono"
                  />
                  <InputError message={errors.phone} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="birth_date">Fecha de nacimiento</Label>
                  <Input
                    id="birth_date"
                    name="birth_date"
                    type="date"
                    defaultValue={customer.birth_date || ''}
                  />
                  <InputError message={errors.birth_date} />
                </div>

                <div className="flex items-center gap-4">
                  <Button disabled={processing} data-test="update-customer-profile-button">
                    Guardar cambios
                  </Button>

                  <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                  >
                    <p className="text-sm text-green-600">Perfil actualizado correctamente.</p>
                  </Transition>
                </div>
              </>
            )}
          </Form>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}