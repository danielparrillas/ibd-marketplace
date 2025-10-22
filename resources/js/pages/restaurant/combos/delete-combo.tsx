import ComboController from '@/actions/App/Http/Controllers/ComboController';
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
import { ComboTable } from '@/types/tables';
import { Form } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
import { setComboToDelete, useCombosStore } from './combosStore';

export default function DeleteCombo() {
    const comboToDelete = useCombosStore((state) => state.comboToDelete) as
        | (ComboTable & { dishes_count?: number })
        | null
        | undefined;
    const open = !!comboToDelete;

    useEffect(() => {
        if (!open) {
            setComboToDelete(null);
        }
    }, [open]);

    if (!comboToDelete) return null;

    return (
        <Sheet
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) setComboToDelete(null);
            }}
        >
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Eliminar Combo
                    </SheetTitle>
                    <SheetDescription>
                        Esta acción no se puede deshacer.
                    </SheetDescription>
                </SheetHeader>
                <Form
                    {...ComboController.destroy.form(comboToDelete.id)}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4 py-6"
                    onSuccess={() => setComboToDelete(null)}
                >
                    {({ processing }) => (
                        <>
                            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                                <p className="text-sm text-foreground">
                                    ¿Estás seguro de que deseas eliminar el
                                    combo{' '}
                                    <strong className="font-semibold">
                                        {comboToDelete.name}
                                    </strong>
                                    ?
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Se eliminarán todos los datos asociados a
                                    este combo, incluyendo las relaciones con
                                    platillos.
                                </p>
                            </div>

                            <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
                                <h4 className="text-sm font-medium">
                                    Información del combo:
                                </h4>
                                <dl className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Nombre:
                                        </dt>
                                        <dd className="font-medium">
                                            {comboToDelete.name}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Precio:
                                        </dt>
                                        <dd className="font-medium">
                                            $
                                            {comboToDelete.combo_price.toFixed(
                                                2,
                                            )}
                                        </dd>
                                    </div>
                                    {comboToDelete.dishes_count !==
                                        undefined && (
                                        <div className="flex justify-between">
                                            <dt className="text-muted-foreground">
                                                Platillos:
                                            </dt>
                                            <dd className="font-medium">
                                                {comboToDelete.dishes_count}
                                            </dd>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Disponible:
                                        </dt>
                                        <dd className="font-medium">
                                            {comboToDelete.is_available
                                                ? 'Sí'
                                                : 'No'}
                                        </dd>
                                    </div>
                                    {comboToDelete.valid_from && (
                                        <div className="flex justify-between">
                                            <dt className="text-muted-foreground">
                                                Válido desde:
                                            </dt>
                                            <dd className="font-medium">
                                                {new Date(
                                                    comboToDelete.valid_from,
                                                ).toLocaleDateString()}
                                            </dd>
                                        </div>
                                    )}
                                    {comboToDelete.valid_until && (
                                        <div className="flex justify-between">
                                            <dt className="text-muted-foreground">
                                                Válido hasta:
                                            </dt>
                                            <dd className="font-medium">
                                                {new Date(
                                                    comboToDelete.valid_until,
                                                ).toLocaleDateString()}
                                            </dd>
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
