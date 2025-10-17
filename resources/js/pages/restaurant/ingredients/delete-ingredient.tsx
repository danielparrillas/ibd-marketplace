import IngredientController from '@/actions/App/Http/Controllers/IngredientController';
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
import { setIngredientToDelete, useIngredientsStore } from './ingredientsStore';

export default function DeleteIngredient() {
    const ingredientToDelete = useIngredientsStore(
        (state) => state.ingredientToDelete,
    );
    const open = !!ingredientToDelete;

    useEffect(() => {
        if (!open) {
            // Reset form when closed
            setIngredientToDelete(null);
        }
    }, [open]);

    if (!ingredientToDelete) {
        return null;
    }

    return (
        <Sheet
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setIngredientToDelete(null);
                }
            }}
        >
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Eliminar Ingrediente
                    </SheetTitle>
                    <SheetDescription>
                        Esta acción no se puede deshacer.
                    </SheetDescription>
                </SheetHeader>
                <Form
                    {...IngredientController.destroy.form(
                        ingredientToDelete.id,
                    )}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4 py-6"
                    onSuccess={() => setIngredientToDelete(null)}
                >
                    {({ processing }) => (
                        <>
                            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                                <p className="text-sm text-foreground">
                                    ¿Estás seguro de que deseas eliminar el
                                    ingrediente{' '}
                                    <strong className="font-semibold">
                                        {ingredientToDelete.name}
                                    </strong>
                                    ?
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Se eliminarán todos los datos asociados a
                                    este ingrediente.
                                </p>
                            </div>

                            <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
                                <h4 className="text-sm font-medium">
                                    Información del ingrediente:
                                </h4>
                                <dl className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Nombre:
                                        </dt>
                                        <dd className="font-medium">
                                            {ingredientToDelete.name}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Stock actual:
                                        </dt>
                                        <dd className="font-medium">
                                            {ingredientToDelete.current_stock}{' '}
                                            {ingredientToDelete.unit_measure}
                                        </dd>
                                    </div>
                                    {ingredientToDelete.supplier && (
                                        <div className="flex justify-between">
                                            <dt className="text-muted-foreground">
                                                Proveedor:
                                            </dt>
                                            <dd className="font-medium">
                                                {ingredientToDelete.supplier}
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
