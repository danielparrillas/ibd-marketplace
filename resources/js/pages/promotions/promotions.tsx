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
import { setOpenStorePromotion } from './promotionsStore';
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
                        'URL de Imagen': false,
                        Alérgenos: false,
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
                    // onClick={() => setDishToEdit(dish)}
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
];
