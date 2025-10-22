import ComboDishController from '@/actions/App/Http/Controllers/ComboDishController';
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
import { Form, usePage } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
import { setComboDishToDelete, useComboDishesStore } from './comboDishesStore';

export default function DeleteComboDish() {
    const { combo } = usePage<{
        combo: { id: number; name: string };
    }>().props;

    const comboDishToDelete = useComboDishesStore(
        (state) => state.comboDishToDelete,
    );
    const open = !!comboDishToDelete;

    useEffect(() => {
        if (!open) {
            setComboDishToDelete(null);
        }
    }, [open]);

    if (!comboDishToDelete) return null;

    const { dish, quantity } = comboDishToDelete;

    return (
        <Sheet
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) setComboDishToDelete(null);
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
                    {...ComboDishController.destroy.form({
                        comboId: combo.id,
                        dish: comboDishToDelete.id,
                    })}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4 py-6"
                    onSuccess={() => setComboDishToDelete(null)}
                >
                    {({ processing }) => (
                        <>
                            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                                <p className="text-sm text-foreground">
                                    ¿Estás seguro de que deseas eliminar el
                                    platillo{' '}
                                    <strong className="font-semibold">
                                        {dish.name}
                                    </strong>{' '}
                                    del combo?
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Este platillo ya no estará asociado con el
                                    combo.
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
                                            {dish.name}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Cantidad:
                                        </dt>
                                        <dd className="font-medium">
                                            {quantity}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Precio:
                                        </dt>
                                        <dd className="font-medium">
                                            ${dish.price}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <SheetFooter className="gap-2">
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
                                    {processing
                                        ? 'Eliminando...'
                                        : 'Eliminar Platillo'}
                                </Button>
                            </SheetFooter>
                        </>
                    )}
                </Form>
            </SheetContent>
        </Sheet>
    );
}
