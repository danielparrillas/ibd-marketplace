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
} from '@/components/ui/sheet';
import { Form } from '@inertiajs/react';
import { useEffect } from 'react';
import { setIngredientToEdit, useIngredientsStore } from './ingredientsStore';

export default function EditIngredient() {
    const ingredientToEdit = useIngredientsStore(
        (state) => state.ingredientToEdit,
    );
    const open = !!ingredientToEdit;

    useEffect(() => {
        if (!open) {
            // Reset form when closed
            setIngredientToEdit(null);
        }
    }, [open]);

    if (!ingredientToEdit) {
        return null;
    }

    return (
        <Sheet
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setIngredientToEdit(null);
                }
            }}
        >
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Editar Ingrediente</SheetTitle>
                    <SheetDescription>
                        Modifica los detalles del ingrediente{' '}
                        <strong>{ingredientToEdit.name}</strong>.
                    </SheetDescription>
                </SheetHeader>
                <Form
                    {...IngredientController.update.form(ingredientToEdit.id)}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4"
                    onSuccess={() => setIngredientToEdit(null)}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                {/* Nombre */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Nombre</Label>
                                    <Input
                                        id="edit-name"
                                        name="name"
                                        type="text"
                                        required
                                        defaultValue={ingredientToEdit.name}
                                        placeholder="Nombre del ingrediente"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* Unidad de medida */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-unit_measure">
                                        Unidad de medida
                                    </Label>
                                    <Input
                                        id="edit-unit_measure"
                                        name="unit_measure"
                                        type="text"
                                        required
                                        defaultValue={
                                            ingredientToEdit.unit_measure
                                        }
                                        placeholder="Ej. kg, g, l, ml, unid"
                                        list="edit-unit-measure-options"
                                    />
                                    <InputError message={errors.unit_measure} />
                                    <datalist id="edit-unit-measure-options">
                                        <option value="kg" />
                                        <option value="g" />
                                        <option value="l" />
                                        <option value="ml" />
                                        <option value="unid" />
                                    </datalist>
                                </div>

                                {/* Stock actual */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-current_stock">
                                        Stock actual
                                    </Label>
                                    <Input
                                        id="edit-current_stock"
                                        name="current_stock"
                                        type="number"
                                        min={0}
                                        step="any"
                                        defaultValue={
                                            ingredientToEdit.current_stock
                                        }
                                        placeholder="0"
                                    />
                                    <InputError
                                        message={errors.current_stock}
                                    />
                                </div>

                                {/* Alerta de stock mínimo */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-min_stock_alert">
                                        Stock mínimo (alerta)
                                    </Label>
                                    <Input
                                        id="edit-min_stock_alert"
                                        name="min_stock_alert"
                                        type="number"
                                        min={0}
                                        step="any"
                                        defaultValue={
                                            ingredientToEdit.min_stock_alert
                                        }
                                        placeholder="0"
                                    />
                                    <InputError
                                        message={errors.min_stock_alert}
                                    />
                                </div>

                                {/* Costo unitario */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-unit_cost">
                                        Costo unitario
                                    </Label>
                                    <Input
                                        id="edit-unit_cost"
                                        name="unit_cost"
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        defaultValue={
                                            ingredientToEdit.unit_cost ?? ''
                                        }
                                        placeholder="0.00"
                                    />
                                    <InputError message={errors.unit_cost} />
                                </div>

                                {/* Proveedor */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-supplier">
                                        Proveedor
                                    </Label>
                                    <Input
                                        id="edit-supplier"
                                        name="supplier"
                                        type="text"
                                        defaultValue={
                                            ingredientToEdit.supplier ?? ''
                                        }
                                        placeholder="Nombre del proveedor"
                                    />
                                    <InputError message={errors.supplier} />
                                </div>

                                {/* Fecha de vencimiento */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-expiration_date">
                                        Fecha de vencimiento
                                    </Label>
                                    <Input
                                        id="edit-expiration_date"
                                        name="expiration_date"
                                        type="date"
                                        defaultValue={
                                            ingredientToEdit.expiration_date ??
                                            ''
                                        }
                                    />
                                    <InputError
                                        message={errors.expiration_date}
                                    />
                                </div>
                            </div>

                            <SheetFooter>
                                <Button type="submit" disabled={processing}>
                                    Actualizar
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
