import { Button } from '@/components/ui/button';
import { DataTable, DataTableColumnHeader } from '@/components/ui/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import ingredients from '@/routes/ingredients';
import { type BreadcrumbItem } from '@/types';
import { DishTable } from '@/types/tables';
import { Head, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Dishes',
        href: ingredients.index().url,
    },
];

type Props = {
    dishes: DishTable[];
};

export default function Dishes() {
    const data = usePage<Props>().props.dishes;
    const success = usePage<Props>().props.success as string | undefined;

    useEffect(() => {
        if (success) {
            // Aquí puedes implementar la lógica para mostrar una notificación o alerta
            toast.success(success);
        }
    }, [success]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Platillos" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable
                    filterBy="Nombre"
                    columns={columns}
                    data={data}
                    calcTotals={false}
                    initialColumnVisibility={{
                        'Fecha de Creación': false,
                        'Fecha de Actualización': false,
                        Descripción: false,
                        'URL de Imagen': false,
                        Alérgenos: false,
                    }}
                    headerContent={
                        <Button
                            variant="outline"
                            size="sm"
                            // onClick={() => setOpenStoreDish(true)}
                        >
                            <Plus />
                        </Button>
                    }
                />
            </div>
        </AppLayout>
    );
}

function ActionCell(props: { dish: DishTable }) {
    const {
        dish,
        dish: { name },
    } = props;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                    <EllipsisVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>Opciones para {name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                    // onClick={() => setDishToEdit(dish)}
                    >
                        Editar
                        <DropdownMenuShortcut>
                            <Pencil />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        // onClick={() => setDishToDelete(dish)}
                        className="text-destructive focus:text-destructive"
                    >
                        Eliminar
                        <DropdownMenuShortcut>
                            <Trash2 />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const columns: ColumnDef<DishTable>[] = [
    {
        id: 'Acciones',
        cell: ({ row }) => <ActionCell dish={row.original} />,
    },
    {
        id: 'Nombre',
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Descripción',
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Precio',
        accessorFn: (row) => `$${row.price.toFixed(2)}`,
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Categoría',
        accessorKey: 'category',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'URL de Imagen',
        accessorKey: 'image_url',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Tiempo de Preparación',
        accessorFn: (row) => `${row.preparation_time} min`,
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Disponible',
        accessorFn: (row) => (row.is_available ? 'Sí' : 'No'),
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Destacado',
        accessorFn: (row) => (row.is_featured ? 'Sí' : 'No'),
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Calorías',
        accessorFn: (row) => (row.calories ? `${row.calories} kcal` : 'N/A'),
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Alérgenos',
        accessorKey: 'allergens',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Fecha de Creación',
        accessorFn: (row) => new Date(row.created_at).toLocaleString(),
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Fecha de Actualización',
        accessorFn: (row) => new Date(row.updated_at).toLocaleString(),
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
];
