import { useEffect, useState } from 'react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
//import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from 'chart.js';
//import restaurant from '@/routes/restaurant';




ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/restaurants/dashboard',
  },
];

export default function Dashboard() {
  //interfaces para los datos del dashboard
  interface SalesByDish {
  dish_id: number;
  dish_name: string;
  total_quantity: number;
}

interface LowInventory {
  name: string;
  current_stock: number;
}

interface OrdersLast7Days {
  order_date: string; // fecha en formato ISO string
  order_count: number;
}

interface SalesTotalLast7Days {
  sale_date: string; // fecha
  total_sales: number;
}

interface TopCombo {
  combo_id: number;
  combo_name: string;
  total_quantity: number;
}

interface DashboardData {
  salesByDish: SalesByDish[];
  lowInventory: LowInventory[];
  ordersLast7Days: OrdersLast7Days[];
  salesTotalLast7Days: SalesTotalLast7Days[];
  topCombos: TopCombo[];
}

  const [data, setData] = useState<DashboardData>({
  salesByDish: [],
  lowInventory: [],
  ordersLast7Days: [],
  salesTotalLast7Days: [],
  topCombos: [],
});
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/restaurant/dashboard-data', { headers: { Accept: 'application/json' } })
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Dashboard" />
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
          <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
        </div>
      </AppLayout>
    );
  }

  // Preparar datos para gráficas
  const pieData = {
    labels: data.salesByDish.map((d) => d.dish_name),
    datasets: [
      {
        data: data.salesByDish.map((d) => d.total_quantity),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#C9CBCF',
          '#36a2eb',
          '#ff6384',
          '#ffce56',
        ],
        hoverOffset: 30,
      },
    ],
  };

  const barDataOrders = {
    labels: data.ordersLast7Days.map((d) => new Date(d.order_date).toLocaleDateString('es-ES')),
    datasets: [
      {
        label: 'Pedidos',
        data: data.ordersLast7Days.map((d) => d.order_count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const lineDataSales = {
    labels: data.salesTotalLast7Days.map((d) => new Date(d.sale_date).toLocaleDateString('es-ES')),
    datasets: [
      {
        label: 'Ventas USD',
        data: data.salesTotalLast7Days.map((d) => d.total_sales),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.3,
      },
    ],
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-64 flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="grid grid-cols-3 gap-4">
          {/* Ventas por Platillo - pastel */}
          <div className="aspect-video rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 bg-white dark:bg-gray-800">
            <h2 className="mb-4 font-semibold text-lg text-gray-700 dark:text-gray-300">Ventas por Platillo (30 días)</h2>
            <Pie data={pieData} />
          </div>

          {/* Ventas totales por día - linea */}
          <div className="col-span-2 h-142 aspect-video rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 bg-white dark:bg-gray-800">
            <h2 className="mb-4 font-semibold text-lg text-gray-700 dark:text-gray-300">Ventas Totales por Día (7 días)</h2>
            <Line data={lineDataSales} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          


          {/* Combos más vendidos */}
            <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 bg-white dark:bg-gray-800 overflow-auto">
            <h2 className="mb-4 font-semibold text-lg text-gray-700 dark:text-gray-300">Combos Más Vendidos</h2>
            <table className="min-w-full border-collapse border border-green-400 text-sm">
                <thead>
                <tr className="bg-green-600 text-white">
                    <th className="border border-green-500 px-4 py-2 text-left font-semibold">Combo</th>
                    <th className="border border-green-500 px-4 py-2 text-right font-semibold">Cantidad Vendida</th>
                </tr>
                </thead>
                <tbody>
                {data.topCombos.length ? (
                    data.topCombos.map((combo) => (
                    <tr
                        key={combo.combo_id}
                        className="odd:bg-indigo-100 even:bg-indigo-50 hover:bg-indigo-300 transition-colors duration-150"
                    >
                        <td className="border border-indigo-300 px-4 py-2">{combo.combo_name}</td>
                        <td className="border border-indigo-300 px-4 py-2 text-right">{combo.total_quantity}</td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan={2} className="px-4 py-2 text-center">
                        No hay datos
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            {/* Aquí puedes agregar espacio para promociones si quieres */}
            </div>

            {/* Pedidos por día - barras */}
          <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 bg-white dark:bg-gray-800">
            <h2 className="mb-4 font-semibold text-lg text-gray-700 dark:text-gray-300">Pedidos por Día (7 días)</h2>
            <Bar data={barDataOrders} />
          </div>

            {/* Inventario Bajo - tabla */}
            <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-4 bg-white dark:bg-gray-800 overflow-auto">
                <h2 className="mb-4 font-semibold text-lg text-gray-700 dark:text-gray-300">Inventario bajo de ingredientes</h2>
                <table className="min-w-full border-separate border-spacing-0 rounded-lg overflow-hidden shadow-lg text-sm">
                    <thead className="bg-blue-400 text-white">
                        <tr>
                        <th className="px-4 py-2 text-left font-bold">Ingrediente</th>
                        <th className="px-4 py-2 text-right font-bold">Cantidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.lowInventory.map((item, idx) => (
                        <tr key={item.name} className={idx % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100' : 'bg-blue-100 hover:bg-blue-150'}>
                            <td className="px-4 py-2">{item.name}</td>
                            <td className="px-4 py-2 text-right">{item.current_stock}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                {/* Aquí puedes agregar espacio para promociones si quieres */}
                </div>

            </div>
      </div>
    </AppLayout>
  );
}
