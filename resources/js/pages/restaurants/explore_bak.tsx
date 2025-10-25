import { Head, Link, usePage } from '@inertiajs/react';
import type { PageProps } from '@inertiajs/core';

type Restaurant = {
  id: number;
  business_name: string;
  logo_url?: string | null;
  phone?: string | null;
};

type Pagination<T> = {
  data: T[];
  links: { url: string | null; label: string; active: boolean }[];
  meta?: any; // si quieres usar meta, puedes tiparlo mejor
};

interface ExploreProps extends PageProps {
  restaurants: Pagination<Restaurant>;
}

export default function Explore(props: ExploreProps) {
  const { restaurants } = props;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Head title="Explorar restaurantes" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explorar restaurantes</h1>

        {/* Grid de restaurantes */}
        <div className="mt-8 flex flex-wrap justify-center gap-8">
          {restaurants.data.map((r) => (
            <div key={r.id} className="w-full sm:w-[340px] bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg overflow-hidden shadow">
              <div className="h-48 bg-gray-100 dark:bg-gray-800">
                <img
                  src={(() => {
                    const p = r.logo_url ?? '';
                    if (!p) return '/placeholder.svg';
                    if (p.startsWith('http') || p.startsWith('/storage')) return p;
                    return `/storage/${p}`;
                  })()}
                  alt={r.business_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{r.business_name}</h3>
                {r.phone && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{r.phone}</p>}
                <Link href={`/restaurant/${r.id}`} className="inline-block mt-4 text-orange-600 hover:underline">
                  Ver menú
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación simple */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {restaurants.links.map((link, idx) => (
            <Link
              key={idx}
              href={link.url || '#'}
              preserveScroll
              className={`px-3 py-1 rounded border ${
                link.active ? 'bg-orange-600 text-white border-orange-600' : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
              } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}