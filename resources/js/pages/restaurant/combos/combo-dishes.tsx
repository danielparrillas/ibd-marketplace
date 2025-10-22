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
import combos from '@/routes/combos';
import { type BreadcrumbItem } from '@/types';
import { ComboDishTable, ComboTable, DishTable } from '@/types/tables';
import { Head, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';

type Props = {
    combo: ComboTable;
    comboDishes: (ComboDishTable & { dish: DishTable })[];
    availableIngredients: DishTable[];
};

export default function ComboDishes() {
    const { combo, comboDishes } = usePage<Props>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard().url,
        },
        {
            title: 'Combos',
            href: combos.index().url,
        },
        {
            title: combo.name,
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
                    data={comboDishes}
                    calcTotals={false}
                    initialColumnVisibility={{
                        'Fecha de Creación': false,
                        'Fecha de Actualización': false,
                        Descripción: false,
                        'URL de Imagen': false,
                        Alérgenos: false,
                    }}
                    // headerContent={
                    //     <StoreDishIngredient>
                    //         <Button
                    //             variant="outline"
                    //             size="sm"
                    //             onClick={() => setOpenStoreDishIngredient(true)}
                    //         >
                    //             <Plus />
                    //         </Button>
                    //     </StoreDishIngredient>
                    // }
                />
            </div>
        </AppLayout>
    );
}

function ActionCell(props: { comboDish: Props['comboDishes'][number] }) {
    const { comboDish } = props;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                    <EllipsisVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>
                    Opciones para {comboDish.dish.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                    // onClick={() => setDishIngredientToEdit(dishIngredient)}
                    >
                        Editar
                        <DropdownMenuShortcut>
                            <Pencil />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        // onClick={() =>
                        //     setDishIngredientToDelete(dishIngredient)
                        // }
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

const columns: ColumnDef<Props['comboDishes'][number]>[] = [
    {
        id: 'Acciones',
        cell: ({ row }) => <ActionCell comboDish={row.original} />,
    },
    {
        id: 'Nombre',
        accessorKey: 'ingredient.name',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Cantidad',
        accessorKey: 'quantity',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
];
