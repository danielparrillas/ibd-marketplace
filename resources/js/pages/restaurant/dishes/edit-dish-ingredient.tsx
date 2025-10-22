import DishIngredientController from '@/actions/App/Http/Controllers/DishIngredientController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useEffect } from 'react';
import {
    setDishIngredientToEdit,
    useDishIngredientsStore,
} from './dishIngredientsStore';

export default function EditDishIngredient() {
    const dishIngredient = useDishIngredientsStore(
        (state) => state.dishIngredientToEdit,
    );
    const open = !!dishIngredient;

    useEffect(() => {
        if (!open) {
            // Reset form when closed
            setDishIngredientToEdit(null);
        }
    }, [open]);

    if (!dishIngredient) {
        return null;
    }

    return (
        <Sheet
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setDishIngredientToEdit(null);
                }
            }}
        >
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Editar ingrediente del platillo</SheetTitle>
                    <SheetDescription>
                        Actualiza la cantidad del ingrediente{' '}
                        <strong>{dishIngredient.ingredient.name}.</strong>
                    </SheetDescription>
                </SheetHeader>
                <Form
                    {...DishIngredientController.update.form({
                        dishId: dishIngredient.dish_id,
                        ingredient: dishIngredient.id,
                    })}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4 py-4"
                    onSuccess={() => setDishIngredientToEdit(null)}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                {/* Cantidad */}
                                <div className="grid gap-2">
                                    <Label htmlFor="quantity_needed">
                                        Cantidad requerida *
                                    </Label>
                                    <Input
                                        id="quantity_needed"
                                        name="quantity_needed"
                                        type="number"
                                        min={0}
                                        step="0.01"
                                    />
                                    <InputError
                                        message={errors.quantity_needed}
                                    />
                                </div>
                            </div>

                            <SheetFooter>
                                <Button type="submit" disabled={processing}>
                                    Guardar cambios
                                </Button>
                                <SheetClose asChild>
                                    <Button type="button" variant="outline">
                                        Cerrar
                                    </Button>
                                </SheetClose>
                            </SheetFooter>
                        </>
                    )}
                </Form>
            </SheetContent>
        </Sheet>
    );
}
