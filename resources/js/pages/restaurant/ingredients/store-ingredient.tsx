import IngredientController from '@/actions/App/Http/Controllers/IngredientController';
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
import { Form } from '@inertiajs/react';
import {
    setOpenStoreIngredient,
    useIngredientsStore,
} from './ingredientsStore';

type Props = {
    children?: React.ReactNode;
};

function StoreIngredient({ children }: Props) {
    const open = useIngredientsStore((state) => state.openStoreIngredient);

    return (
        <Sheet open={open} onOpenChange={setOpenStoreIngredient}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Agregar Ingrediente</SheetTitle>
                    <SheetDescription>
                        Escribe los detalles del nuevo ingrediente a
                        continuación.
                    </SheetDescription>
                </SheetHeader>
                <Form
                    {...IngredientController.store.form()}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4"
                    onSuccess={() => setOpenStoreIngredient(false)}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                {/* Nombre */}
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="Nombre del ingrediente"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* Unidad de medida */}
                                <div className="grid gap-2">
                                    <Label htmlFor="unit_measure">
                                        Unidad de medida
                                    </Label>
                                    <Input
                                        id="unit_measure"
                                        name="unit_measure"
                                        type="text"
                                        required
                                        placeholder="Ej. kg, g, l, ml, unid"
                                        list="unit-measure-options"
                                    />
                                    <InputError message={errors.unit_measure} />
                                    <datalist id="unit-measure-options">
                                        <option value="kg" />
                                        <option value="g" />
                                        <option value="l" />
                                        <option value="ml" />
                                        <option value="unid" />
                                    </datalist>
                                </div>

                                {/* Stock actual */}
                                <div className="grid gap-2">
                                    <Label htmlFor="current_stock">
                                        Stock actual
                                    </Label>
                                    <Input
                                        id="current_stock"
                                        name="current_stock"
                                        type="number"
                                        min={0}
                                        step="any"
                                        placeholder="0"
                                    />
                                    <InputError
                                        message={errors.current_stock}
                                    />
                                </div>

                                {/* Alerta de stock mínimo */}
                                <div className="grid gap-2">
                                    <Label htmlFor="min_stock_alert">
                                        Stock mínimo (alerta)
                                    </Label>
                                    <Input
                                        id="min_stock_alert"
                                        name="min_stock_alert"
                                        type="number"
                                        min={0}
                                        step="any"
                                        placeholder="0"
                                    />
                                    <InputError
                                        message={errors.min_stock_alert}
                                    />
                                </div>

                                {/* Costo unitario */}
                                <div className="grid gap-2">
                                    <Label htmlFor="unit_cost">
                                        Costo unitario
                                    </Label>
                                    <Input
                                        id="unit_cost"
                                        name="unit_cost"
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                    <InputError message={errors.unit_cost} />
                                </div>

                                {/* Proveedor */}
                                <div className="grid gap-2">
                                    <Label htmlFor="supplier">Proveedor</Label>
                                    <Input
                                        id="supplier"
                                        name="supplier"
                                        type="text"
                                        placeholder="Nombre del proveedor"
                                    />
                                    <InputError message={errors.supplier} />
                                </div>

                                {/* Fecha de vencimiento */}
                                <div className="grid gap-2">
                                    <Label htmlFor="expiration_date">
                                        Fecha de vencimiento
                                    </Label>
                                    <Input
                                        id="expiration_date"
                                        name="expiration_date"
                                        type="date"
                                    />
                                    <InputError
                                        message={errors.expiration_date}
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

export default StoreIngredient;
