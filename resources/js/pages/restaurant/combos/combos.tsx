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
//import { dashboard } from '@/routes';
import combos from '@/routes/combos';
import { type BreadcrumbItem } from '@/types';
import { ComboTable } from '@/types/tables';
import { Head, Link, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical, Image, Pencil, Plus, Trash2 } from 'lucide-react';
import {
    setComboToDelete,
    setComboToEdit,
    setComboToUploadImage,
    setOpenStoreCombo,
} from './combosStore';
import DeleteCombo from './delete-combo';
import EditCombo from './edit-combo';
import ImageCombo from './image-combo';
import StoreCombo from './store-combo';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        //href: dashboard().url,
        href: '/restaurants/dashboard',
    },
    {
        title: 'Combos',
        href: combos.index().url,
    },
];

type Props = {
    combos: (ComboTable & { ingredients_count: number })[];
};

export default function Combos() {
    const data = usePage<Props>().props.combos;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Combos" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable
                    filterBy="Nombre"
                    columns={columns}
                    data={data}
                    calcTotals={false}
                    headerContent={
                        <StoreCombo>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setOpenStoreCombo(true)}
                            >
                                <Plus />
                            </Button>
                        </StoreCombo>
                    }
                />
            </div>
            <ImageCombo />
            <EditCombo />
            <DeleteCombo />
        </AppLayout>
    );
}

function ActionCell(props: { combo: Props['combos'][0] }) {
    const { combo } = props;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                    <EllipsisVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>
                    Opciones para {combo.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setComboToEdit(combo)}>
                        Editar
                        <DropdownMenuShortcut>
                            <Pencil />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    {/* <Link
                        href={combos.ingredients.index({ comboId: combo.id }).url}
                    >
                        <DropdownMenuItem>
                            Ver platillos
                            <DropdownMenuShortcut>
                                <List />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link> */}
                    <DropdownMenuItem
                        onClick={() => setComboToUploadImage(combo)}
                    >
                        Cambiar Imagen
                        <DropdownMenuShortcut>
                            <Image />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setComboToDelete(combo)}
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

const columns: ColumnDef<Props['combos'][0]>[] = [
    {
        id: 'Acciones',
        cell: ({ row }) => <ActionCell combo={row.original} />,
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
        accessorFn: (row) => `$${row.combo_price.toFixed(2)}`,
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Imagen',
        accessorKey: 'image_url',
        cell: ({ row: { original: combo } }) => (
            <Badge
                onClick={() => setComboToUploadImage(combo)}
                variant={combo.image_url ? 'default' : 'outline'}
                className="cursor-pointer"
            >
                {combo.image_url ? 'Ver Imagen' : 'Sin Imagen'}
            </Badge>
        ),
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Platillos',
        accessorKey: 'dishes_count',
        cell: ({ getValue, row: { original: c } }) => (
            <Link href={combos.dishes.index({ comboId: c.id }).url}>
                <Badge variant={getValue() ? 'default' : 'outline'}>
                    {getValue() as string}
                </Badge>
            </Link>
        ),
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Disponible',
        accessorFn: (row) => (row.is_available ? 'Sí' : 'No'),
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Válido Desde',
        accessorKey: 'valid_from',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
    {
        id: 'Válido Hasta',
        accessorKey: 'valid_until',
        header: ({ column }) => <DataTableColumnHeader column={column} />,
    },
];
