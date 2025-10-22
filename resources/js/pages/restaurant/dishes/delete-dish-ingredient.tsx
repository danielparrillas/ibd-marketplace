import DishIngredientController from '@/actions/App/Http/Controllers/DishIngredientController';
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
import {
    setDishIngredientToDelete,
    useDishIngredientsStore,
} from './dishIngredientsStore';

export default function DeleteDishIngredient() {
    const { dish } = usePage<{
        dish: { id: number; name: string };
    }>().props;

    const dishIngredientToDelete = useDishIngredientsStore(
        (state) => state.dishIngredientToDelete,
    );
    const open = !!dishIngredientToDelete;

    useEffect(() => {
        if (!open) {
            setDishIngredientToDelete(null);
        }
    }, [open]);

    if (!dishIngredientToDelete) return null;

    const { ingredient, quantity_needed } = dishIngredientToDelete;

    return (
        <Sheet
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) setDishIngredientToDelete(null);
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
                    {...DishIngredientController.destroy.form({
                        dishId: dish.id,
                        ingredient: dishIngredientToDelete.id,
                    })}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4 py-6"
                    onSuccess={() => setDishIngredientToDelete(null)}
                >
                    {({ processing }) => (
                        <>
                            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                                <p className="text-sm text-foreground">
                                    ¿Estás seguro de que deseas eliminar el
                                    ingrediente{' '}
                                    <strong className="font-semibold">
                                        {ingredient.name}
                                    </strong>{' '}
                                    del platillo?
                                </p>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Este ingrediente ya no estará asociado con
                                    el platillo.
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
                                            {ingredient.name}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Cantidad Requerida:
                                        </dt>
                                        <dd className="font-medium">
                                            {quantity_needed}{' '}
                                            {ingredient.unit_measure}
                                        </dd>
                                    </div>
                                    {ingredient.supplier && (
                                        <div className="flex justify-between">
                                            <dt className="text-muted-foreground">
                                                Proveedor:
                                            </dt>
                                            <dd className="font-medium">
                                                {ingredient.supplier}
                                            </dd>
                                        </div>
                                    )}
                                    {ingredient.unit_cost && (
                                        <div className="flex justify-between">
                                            <dt className="text-muted-foreground">
                                                Costo Unitario:
                                            </dt>
                                            <dd className="font-medium">
                                                ${ingredient.unit_cost}
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
