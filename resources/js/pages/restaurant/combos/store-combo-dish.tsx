import ComboDishController from '@/actions/App/Http/Controllers/ComboDishController';
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
import { ComboTable, DishTable } from '@/types/tables';
import { Form, usePage } from '@inertiajs/react';
import { setOpenStoreComboDish, useComboDishesStore } from './comboDishesStore';

type Props = {
    children?: React.ReactNode;
};

function StoreComboDish({ children }: Props) {
    const open = useComboDishesStore((state) => state.openStoreComboDish);

    const availableDishes = usePage().props.availableDishes as DishTable[];

    return (
        <Sheet open={open} onOpenChange={setOpenStoreComboDish}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Agregar Platillo al Combo</SheetTitle>
                    <SheetDescription>
                        Selecciona el platillo y la cantidad a agregar al combo.
                    </SheetDescription>
                </SheetHeader>
                <Form
                    {...ComboDishController.store.form({
                        comboId: (usePage().props.combo as ComboTable)
                            .id as number,
                    })}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4 py-4"
                    onSuccess={() => setOpenStoreComboDish(false)}
                    onError={(errors) => console.log(errors)}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                {/** Platillo */}
                                <div className="grid gap-2">
                                    <Label htmlFor="dish_id">Platillo *</Label>
                                    <select
                                        id="dish_id"
                                        name="dish_id"
                                        required
                                        className="rounded-md border border-gray-300 px-3 py-2"
                                    >
                                        <option value="">
                                            Selecciona un platillo
                                        </option>
                                        {availableDishes.map((dish) => (
                                            <option
                                                key={dish.id}
                                                value={dish.id}
                                            >
                                                {dish.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.dish_id} />
                                </div>
                                {/* Cantidad */}
                                <div className="grid gap-2">
                                    <Label htmlFor="quantity">Cantidad *</Label>
                                    <Input
                                        id="quantity"
                                        name="quantity"
                                        type="number"
                                        min={1}
                                        step="1"
                                        defaultValue={1}
                                    />
                                    <InputError message={errors.quantity} />
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

export default StoreComboDish;
