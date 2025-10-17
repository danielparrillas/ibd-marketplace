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
import { IngredientTable } from '@/types/tables';
import { Head, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import DeleteIngredient from './delete-ingredient';
import EditIngredient from './edit-ingredient';
import {
    setIngredientToDelete,
    setIngredientToEdit,
    setOpenStoreIngredient,
} from './ingredientsStore';
import StoreIngredient from './store-ingredient';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Ingredientes',
        href: ingredients.index().url,
    },
];

type Props = {
    ingredients: IngredientTable[];
};

export default function Ingredientes() {
    const data = usePage<Props>().props.ingredients;
    const success = usePage<Props>().props.success as string | undefined;

    useEffect(() => {
        if (success) toast.success(success);
    }, [success]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ingredientes" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable
                    filterBy="Nombre"
                    columns={columns}
                    data={data}
                    calcTotals={false}
                    initialColumnVisibility={{
                        'Fecha de Creación': false,
                        'Fecha de Actualización': false,
                    }}
                    headerContent={
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setOpenStoreIngredient(true)}
                        >
                            <Plus />
                        </Button>
                    }
                />
            </div>
            <StoreIngredient />
            <EditIngredient />
            <DeleteIngredient />
        </AppLayout>
    );
}

function ActionCell(props: { ingredient: IngredientTable }) {
    const {
        ingredient,
        ingredient: { name },
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
                        onClick={() => setIngredientToEdit(ingredient)}
                    >
                        Editar
                        <DropdownMenuShortcut>
                            <Pencil />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setIngredientToDelete(ingredient)}
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

const columns: ColumnDef<IngredientTable>[] = [
    {
        id: 'Acciones',
        cell: ({ row }) => <ActionCell ingredient={row.original} />,
    },
    {
        id: 'Nombre',
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Unidad de Medida',
        accessorKey: 'unit_measure',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Stock Actual',
        accessorKey: 'current_stock',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Alerta de Stock Mínimo',
        accessorKey: 'min_stock_alert',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Costo Unitario',
        accessorKey: 'unit_cost',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Proveedor',
        accessorKey: 'supplier',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Fecha de Expiración',
        accessorKey: 'expiration_date',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Días para Expirar',
        accessorFn: (row) => {
            if (!row.expiration_date) return 'N/A';
            const today = new Date();
            const expirationDate = new Date(row.expiration_date);
            const diffTime = expirationDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays >= 0 ? diffDays : 'Expirado';
        },
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
