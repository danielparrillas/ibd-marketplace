import DishController from '@/actions/App/Http/Controllers/DishController';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Form } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
import { setDishToDelete, useDishesStore } from './dishesStore';

export default function DeleteDish() {
    const dishToDelete = useDishesStore((state) => state.dishToDelete);
    const open = !!dishToDelete;

    useEffect(() => {
        if (!open) {
            setDishToDelete(null);
        }
    }, [open]);

    if (!dishToDelete) return null;

    return (
        <Sheet
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) setDishToDelete(null);
            }}
        >
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Eliminar Platillo
                    </SheetTitle>
                    <SheetDescription>
                        Esta acción no se puede deshacer.
                    </SheetDescription>
                </SheetHeader>
                <Form
                    {...DishController.destroy.form(dishToDelete.id)}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4 py-6"
                    onSuccess={() => setDishToDelete(null)}
                >
                    {({ processing }) => (
                        <>
                            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                                <p className="text-sm text-foreground">
                                    ¿Estás seguro de que deseas eliminar el
                                    platillo{' '}
                                    <strong className="font-semibold">
                                        {dishToDelete.name}
                                    </strong>
                                    ?
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Se eliminarán todos los datos asociados a
                                    este platillo.
                                </p>
                            </div>

                            <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
                                <h4 className="text-sm font-medium">
                                    Información del platillo:
                                </h4>
                                <dl className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Nombre:
                                        </dt>
                                        <dd className="font-medium">
                                            {dishToDelete.name}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Categoría:
                                        </dt>
                                        <dd className="font-medium">
                                            {dishToDelete.category}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Precio:
                                        </dt>
                                        <dd className="font-medium">
                                            ${dishToDelete.price.toFixed(2)}
                                        </dd>
                                    </div>
                                    {dishToDelete.is_featured && (
                                        <div className="flex justify-between">
                                            <dt className="text-muted-foreground">
                                                Destacado:
                                            </dt>
                                            <dd className="font-medium">Sí</dd>
                                        </div>
                                    )}
                                </dl>
                            </div>

                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={processing}
                                    >
                                        Cancelar
                                    </Button>
                                </SheetClose>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={processing}
                                >
                                    {processing ? 'Eliminando...' : 'Eliminar'}
                                </Button>
                            </SheetFooter>
                        </>
                    )}
                </Form>
            </SheetContent>
        </Sheet>
    );
}
