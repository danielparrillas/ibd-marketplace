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
import edit from '@/routes/restaurant';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Perfil del restaurante',
    href: edit.profile.edit().url,
  },
];

export default function RestaurantProfile() {
interface Restaurant {
    responsible_name: string;
    business_name: string;
    legal_name?: string;
    phone: string;
    legal_document?: string;
    business_license?: string;
    description?: string;
    logo_url?: string;
}

const { restaurant } = usePage<{ restaurant: Restaurant }>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Perfil del Restaurante" />

      <SettingsLayout>
        {/* <div className="container mx-auto px-4"> */}
        <div className="space-y-6">
          <HeadingSmall title="Información del restaurante" description="Actualiza los detalles de tu restaurante" />

          <Form
            {...edit.profile.update.form()}
            encType="multipart/form-data"
            className="space-y-6"
            options={{
              preserveScroll: true,
            }}
          >
            {({ processing, recentlySuccessful, errors }) => (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="responsible_name">Nombre del responsable</Label>
                  <Input
                    id="responsible_name"
                    defaultValue={restaurant.responsible_name}
                    name="responsible_name"
                    required
                    className="mt-1 block w-full"
                    placeholder="Responsible Name"
                  />
                  <InputError message={errors.responsible_name} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="business_name">Nombre del negocio</Label>
                  <Input
                    id="business_name"
                    defaultValue={restaurant.business_name}
                    name="business_name"
                    required
                    className="mt-1 block w-full"
                    placeholder="Business Name"
                  />
                  <InputError message={errors.business_name} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="legal_name">Nombre legal</Label>
                  <Input
                    id="legal_name"
                    defaultValue={restaurant.legal_name}
                    name="legal_name"
                    className="mt-1 block w-full"
                    placeholder="Legal Name"
                  />
                  <InputError message={errors.legal_name} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    defaultValue={restaurant.phone}
                    name="phone"
                    required
                    className="mt-1 block w-full"
                    placeholder="Phone"
                  />
                  <InputError message={errors.phone} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="legal_document">Documento legal</Label>
                  <Input
                    id="legal_document"
                    defaultValue={restaurant.legal_document}
                    name="legal_document"
                    className="mt-1 block w-full"
                    placeholder="Legal Document"
                  />
                  <InputError message={errors.legal_document} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="business_license">Licencia de negocio</Label>
                  <Input
                    id="business_license"
                    defaultValue={restaurant.business_license}
                    name="business_license"
                    className="mt-1 block w-full"
                    placeholder="Business License"
                  />
                  <InputError message={errors.business_license} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    defaultValue={restaurant.description}
                    name="description"
                    className="mt-1 block w-full"
                    placeholder="Description"
                  />
                  <InputError message={errors.description} />
                </div>

                {/* Carga de Logo (archivo) */}
                <div className="grid gap-2">
                  <Label htmlFor="logo">Logo</Label>
                  <Input
                    id="logo"
                    name="logo"
                    type="file"
                    accept="image/*"
                    className="mt-1 block w-full"
                  />
                  {restaurant.logo_url && (
                    <div className="mt-2">
                      <img
                        src={restaurant.logo_url.startsWith('http') ? restaurant.logo_url : `/storage/${restaurant.logo_url}`}
                        alt="Logo actual"
                        className="h-16 w-16 object-cover rounded"
                      />
                    </div>
                  )}
                  <InputError message={errors.logo} />
                </div>

                <div className="flex items-center gap-4">
                  <Button disabled={processing} data-test="update-restaurant-profile-button">
                    Actualizar información
                  </Button>

                  <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                  >
                    <p className="text-sm text-green-600">Se ha actualizado la información correctamente.</p>
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
