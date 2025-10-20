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
import dishes from '@/routes/dishes';
import { type BreadcrumbItem } from '@/types';
import {
    DishIngredientTable,
    DishTable,
    IngredientTable,
} from '@/types/tables';
import { Head, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical, Image, Pencil, Plus, Trash2 } from 'lucide-react';
import DeleteDish from './delete-dish';
import { setOpenStoreDish } from './dishesStore';
import EditDish from './edit-dish';
import ImageDish from './image-dish';
import StoreDish from './store-dish';

type Props = {
    dish: DishTable;
    dishIngredients: (DishIngredientTable & { ingredient: IngredientTable })[];
};

export default function DishIngredients() {
    const { dish, dishIngredients } = usePage<Props>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Dishes',
            href: dishes.index().url,
        },
        {
            title: dish.name,
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Platillos" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable
                    filterBy="Nombre"
                    columns={columns}
                    data={dishIngredients}
                    calcTotals={false}
                    initialColumnVisibility={{
                        'Fecha de Creación': false,
                        'Fecha de Actualización': false,
                        Descripción: false,
                        'URL de Imagen': false,
                        Alérgenos: false,
                    }}
                    headerContent={
                        <StoreDish>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setOpenStoreDish(true)}
                            >
                                <Plus />
                            </Button>
                        </StoreDish>
                    }
                />
            </div>
            <ImageDish />
            <EditDish />
            <DeleteDish />
        </AppLayout>
    );
}

function ActionCell(props: {
    dishIngredient: Props['dishIngredients'][number];
}) {
    const {
        dishIngredient,
        dishIngredient: {
            ingredient: { name },
        },
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
                    <DropdownMenuItem>
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

const columns: ColumnDef<Props['dishIngredients'][number]>[] = [
    {
        id: 'Acciones',
        cell: ({ row }) => <ActionCell dishIngredient={row.original} />,
    },
    {
        id: 'Nombre',
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Cantidad',
        accessorKey: 'quantity',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
];
