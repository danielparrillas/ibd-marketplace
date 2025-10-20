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
    SheetTrigger,
} from '@/components/ui/sheet';
import { DishTable, IngredientTable } from '@/types/tables';
import { Form, usePage } from '@inertiajs/react';
import {
    setOpenStoreDishIngredient,
    useDishIngredientsStore,
} from './dishIngredientsStore';

type Props = {
    children?: React.ReactNode;
};

function StoreDishIngredient({ children }: Props) {
    const open = useDishIngredientsStore(
        (state) => state.openStoreDishIngredient,
    );

    const availableIngredients = usePage().props
        .availableIngredients as IngredientTable[];

    return (
        <Sheet open={open} onOpenChange={setOpenStoreDishIngredient}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Agregar Platillo</SheetTitle>
                    <SheetDescription>
                        Escribe los detalles del nuevo platillo a continuación.
                    </SheetDescription>
                </SheetHeader>
                <Form
                    {...DishIngredientController.store.form({
                        dishId: (usePage().props.dish as DishTable)
                            .id as number,
                    })}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4 py-4"
                    onSuccess={() => setOpenStoreDishIngredient(false)}
                    onError={(errors) => console.log(errors)}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                {/** Ingrediente */}
                                <select
                                    id="ingredient_id"
                                    name="ingredient_id"
                                    required
                                    className="rounded-md border border-gray-300 px-3 py-2"
                                >
                                    <option value="">
                                        Selecciona un ingrediente
                                    </option>
                                    {availableIngredients.map((ingredient) => (
                                        <option
                                            key={ingredient.id}
                                            value={ingredient.id}
                                        >
                                            {ingredient.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.ingredient_id} />
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
                                    Guardar
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

export default StoreDishIngredient;
