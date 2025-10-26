import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Transition } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Direcciones de entrega',
    href: '/addresses',
  },
];

interface Address {
  id: number;
  address_line_1: string;
  address_line_2?: string;
  latitude?: number | null;
  longitude?: number | null;
  delivery_instructions?: string;
}

export default function CustomerAddresses({ addresses }: { addresses: Address[] }) {
  const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
    address_line_1: '',
    address_line_2: '',
    latitude: '',
    longitude: '',
    delivery_instructions: '',
  });

  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  // Rellena el formulario para editar
  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setData({
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 ?? '',
      latitude: address.latitude?.toString() ?? '',
      longitude: address.longitude?.toString() ?? '',
      delivery_instructions: address.delivery_instructions ?? '',
    });
  };

  // Al guardar/actualizar
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      put(`/addresses/${editingAddress.id}`, {
        onSuccess: () => {
          setShowSaved(true);
          reset();
          setEditingAddress(null);
          setTimeout(() => setShowSaved(false), 2000);
        },
      });
    } else {
      post('/addresses', {
        onSuccess: () => {
          setShowSaved(true);
          reset();
          setTimeout(() => setShowSaved(false), 2000);
        },
      });
    }
  };

  // Eliminar dirección
  const handleDestroy = (url: string) => {
    destroy(url, {
      onSuccess: () => {
        setShowDeleted(true);
        setTimeout(() => setShowDeleted(false), 2000);
        // Si justo se estaba editando esa dirección, limpia el formulario también
        if (editingAddress && url.endsWith(`/${editingAddress.id}`)) {
          reset();
          setEditingAddress(null);
        }
      },
    });
  };

  // Geolocalización navegador
  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      alert('La geolocalización no es soportada por tu navegador.');
      return;
    }
    let locationReceived = false;
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords;
        setData('latitude', latitude.toString());
        setData('longitude', longitude.toString());
        locationReceived = true;
      },
      (error: GeolocationPositionError) => {
        if (locationReceived && error.code === error.PERMISSION_DENIED) return;
        if (error.code === error.PERMISSION_DENIED) {
          alert('El usuario rechazó el permiso de geolocalización.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          alert('No se pudo determinar la ubicación.');
        } else if (error.code === error.TIMEOUT) {
          alert('La solicitud de ubicación expiró.');
        } else {
          alert('Ocurrió un error desconocido al obtener la ubicación.');
        }
        console.error('Error de geolocalización:', error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingAddress(null);
    reset();
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Direcciones de entrega" />
      <SettingsLayout>
        <div className="container mx-auto px-4 space-y-6">
          <HeadingSmall
            title="Direcciones de entrega"
            description="Agrega o administra las ubicaciones donde deseas recibir tus pedidos."
          />

          <Transition
            show={showSaved}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-green-600">
              {editingAddress ? '¡Dirección actualizada exitosamente!' : '¡Dirección guardada exitosamente!'}
            </p>
          </Transition>
          <Transition
            show={showDeleted}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-red-600">
              ¡Dirección eliminada exitosamente!
            </p>
          </Transition>

          <form
            onSubmit={submit}
            className="space-y-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="address_line_1">Dirección principal</Label>
              <Input
                id="address_line_1"
                name="address_line_1"
                value={data.address_line_1}
                onChange={(e) => setData('address_line_1', e.target.value)}
                required
                placeholder="Ej. Calle 123 #45"
              />
              <InputError message={errors.address_line_1} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address_line_2">Dirección complementaria</Label>
              <Input
                id="address_line_2"
                name="address_line_2"
                value={data.address_line_2}
                onChange={(e) => setData('address_line_2', e.target.value)}
                placeholder="Apartamento o referencias adicionales"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              <div>
                <Label htmlFor="latitude">Latitud</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  value={data.latitude}
                  onChange={(e) => setData('latitude', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="longitude">Longitud</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  value={data.longitude}
                  onChange={(e) => setData('longitude', e.target.value)}
                />
              </div>
            </div>
            <Button type="button" onClick={handleGetLocation}>
              Obtener mi ubicación
            </Button>
            <div className="grid gap-2">
              <Label htmlFor="delivery_instructions">Instrucciones de entrega</Label>
              <Input
                id="delivery_instructions"
                name="delivery_instructions"
                value={data.delivery_instructions}
                onChange={(e) => setData('delivery_instructions', e.target.value)}
                placeholder="Ej. Tocar timbre o llamar al llegar"
              />
              <InputError message={errors.delivery_instructions} />
            </div>
            <div className="flex items-center gap-4">
              <Button disabled={processing}>
                {editingAddress ? 'Guardar cambios' : 'Guardar dirección'}
              </Button>
              {editingAddress && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={processing}
                >
                  Cancelar edición
                </Button>
              )}
            </div>
          </form>

          {/* Listado de direcciones existentes */}
          <div className="space-y-4 border-t pt-6">
            {addresses.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Aún no has agregado direcciones de entrega.
              </p>
            ) : (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className={`flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-4 shadow-sm bg-white cursor-pointer ${editingAddress?.id === address.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => handleEdit(address)}
                  title="Haz clic para editar"
                >
                  <div>
                    <p className="font-semibold">{address.address_line_1}</p>
                    {address.address_line_2 && <p>{address.address_line_2}</p>}
                    {address.latitude && address.longitude && (
                      <p className="text-sm text-gray-500">
                        Ubicación: {address.latitude}, {address.longitude}
                      </p>
                    )}
                    {address.delivery_instructions && (
                      <p className="text-sm text-gray-600 italic">
                        {address.delivery_instructions}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('¿Eliminar esta dirección?')) {
                        handleDestroy(`/addresses/${address.id}`);
                      }
                    }}
                    className="mt-2 md:mt-0"
                  >
                    Eliminar
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
