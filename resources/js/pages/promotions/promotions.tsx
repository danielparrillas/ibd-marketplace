import { Badge } from '@/components/ui/badge';
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
import promotions from '@/routes/promotions';
import { type BreadcrumbItem } from '@/types';
import { DishTable, PromotionTable, RestaurantTable } from '@/types/tables';
import { Head, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical, Image, Pencil, Plus, Trash2 } from 'lucide-react';
import DeletePromotion from './delete-promotion';
import EditPromotion from './edit-promotion';
import {
    setOpenStorePromotion,
    setPromotionToDelete,
    setPromotionToEdit,
} from './promotionsStore';
import StorePromotion from './store-promotion';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Promociones',
        href: promotions.index().url,
    },
];

type Props = {
    promotions: PromotionTable[];
    restaurant: RestaurantTable;
    dishes: DishTable[];
};

export default function Promotions() {
    const data = usePage<Props>().props.promotions;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Promociones" />
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
                        'Categorías Objetivo': false,
                        'IDs de Platillos Objetivo': false,
                    }}
                    headerContent={
                        <StorePromotion>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setOpenStorePromotion(true)}
                            >
                                <Plus />
                            </Button>
                        </StorePromotion>
                    }
                />
            </div>
            <EditPromotion />
            <DeletePromotion />
        </AppLayout>
    );
}

function ActionCell(props: { promotion: Props['promotions'][0] }) {
    const { promotion } = props;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                    <EllipsisVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>
                    Opciones para {promotion.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => setPromotionToEdit(promotion)}
                    >
                        Editar
                        <DropdownMenuShortcut>
                            <Pencil />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                    // onClick={() => setDishToUploadImage(dish)}
                    >
                        Cambiar Imagen
                        <DropdownMenuShortcut>
                            <Image />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setPromotionToDelete(promotion)}
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

const columns: ColumnDef<Props['promotions'][0]>[] = [
    {
        id: 'Acciones',
        cell: ({ row }) => <ActionCell promotion={row.original} />,
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
        id: 'Tipo de Promoción',
        accessorFn: (row) => {
            const types = {
                percentage: 'Porcentaje',
                fixedamount: 'Monto Fijo',
                buyxgety: 'Compra X Lleva Y',
            };
            return types[row.promotion_type] || row.promotion_type;
        },
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Valor de Descuento',
        accessorFn: (row) =>
            row.promotion_type === 'percentage'
                ? `${row.discount_value}%`
                : `$${row.discount_value.toFixed(2)}`,
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Monto Mínimo',
        accessorFn: (row) =>
            row.min_order_amount
                ? `$${row.min_order_amount.toFixed(2)}`
                : 'N/A',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Descuento Máximo',
        accessorFn: (row) =>
            row.max_discount ? `$${row.max_discount.toFixed(2)}` : 'Sin límite',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Se Aplica a',
        accessorFn: (row) => {
            const applies = {
                all: 'Todos',
                category: 'Categoría',
                specificdishes: 'Platillos Específicos',
            };
            return applies[row.applies_to] || row.applies_to;
        },
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Categorías Objetivo',
        accessorKey: 'target_categories',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'IDs de Platillos Objetivo',
        accessorKey: 'target_dish_ids',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Válido Desde',
        accessorFn: (row) => new Date(row.valid_from).toLocaleString(),
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Válido Hasta',
        accessorFn: (row) => new Date(row.valid_until).toLocaleString(),
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Activa',
        accessorFn: (row) => (row.is_active ? 'Sí' : 'No'),
        cell: ({ row }) => (
            <Badge variant={row.original.is_active ? 'default' : 'outline'}>
                {row.original.is_active ? 'Activa' : 'Inactiva'}
            </Badge>
        ),
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Límite de Uso',
        accessorFn: (row) => (row.usage_limit ? row.usage_limit : 'Ilimitado'),
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Veces Utilizada',
        accessorKey: 'usage_count',
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
