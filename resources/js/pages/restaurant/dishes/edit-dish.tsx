import DishController from '@/actions/App/Http/Controllers/DishController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Textarea } from '@/components/ui/textarea';
import { Form } from '@inertiajs/react';
import { useEffect } from 'react';
import { setDishToEdit, useDishesStore } from './dishesStore';

export default function EditDish() {
    const dishToEdit = useDishesStore((state) => state.dishToEdit);
    const open = !!dishToEdit;

    useEffect(() => {
        if (!open) {
            // Reset form when closed
            setDishToEdit(null);
        }
    }, [open]);

    if (!dishToEdit) {
        return null;
    }

    return (
        <Sheet
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setDishToEdit(null);
                }
            }}
        >
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Editar Platillo</SheetTitle>
                    <SheetDescription>
                        Actualiza los detalles del platillo a continuación.
                    </SheetDescription>
                </SheetHeader>
                <Form
                    {...DishController.update.form(dishToEdit.id)}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4 py-4"
                    onSuccess={() => setDishToEdit(null)}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                {/* Nombre */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Nombre *</Label>
                                    <Input
                                        id="edit-name"
                                        name="name"
                                        type="text"
                                        required
                                        defaultValue={dishToEdit.name}
                                        placeholder="Nombre del platillo"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* Descripción */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-description">
                                        Descripción
                                    </Label>
                                    <Textarea
                                        id="edit-description"
                                        name="description"
                                        defaultValue={
                                            dishToEdit.description ?? ''
                                        }
                                        placeholder="Descripción del platillo"
                                        rows={3}
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                {/* Precio */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-price">Precio *</Label>
                                    <Input
                                        id="edit-price"
                                        name="price"
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        required
                                        defaultValue={dishToEdit.price}
                                        placeholder="0.00"
                                    />
                                    <InputError message={errors.price} />
                                </div>

                                {/* Categoría */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-category">
                                        Categoría *
                                    </Label>
                                    <Input
                                        id="edit-category"
                                        name="category"
                                        type="text"
                                        required
                                        defaultValue={dishToEdit.category}
                                        placeholder="Ej. Entradas, Platos fuertes, Postres"
                                        list="edit-category-options"
                                    />
                                    <InputError message={errors.category} />
                                    <datalist id="edit-category-options">
                                        <option value="Entradas" />
                                        <option value="Platos fuertes" />
                                        <option value="Postres" />
                                        <option value="Bebidas" />
                                        <option value="Ensaladas" />
                                        <option value="Sopas" />
                                    </datalist>
                                </div>

                                {/* Tiempo de Preparación */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-preparation_time">
                                        Tiempo de Preparación (min) *
                                    </Label>
                                    <Input
                                        id="edit-preparation_time"
                                        name="preparation_time"
                                        type="number"
                                        min={0}
                                        required
                                        defaultValue={
                                            dishToEdit.preparation_time
                                        }
                                        placeholder="0"
                                    />
                                    <InputError
                                        message={errors.preparation_time}
                                    />
                                </div>

                                {/* Calorías */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-calories">
                                        Calorías (kcal)
                                    </Label>
                                    <Input
                                        id="edit-calories"
                                        name="calories"
                                        type="number"
                                        min={0}
                                        defaultValue={dishToEdit.calories ?? ''}
                                        placeholder="0"
                                    />
                                    <InputError message={errors.calories} />
                                </div>

                                {/* Alérgenos */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-allergens">
                                        Alérgenos
                                    </Label>
                                    <Input
                                        id="edit-allergens"
                                        name="allergens"
                                        type="text"
                                        defaultValue={
                                            dishToEdit.allergens ?? ''
                                        }
                                        placeholder="Ej. Gluten, Lactosa, Frutos secos"
                                    />
                                    <InputError message={errors.allergens} />
                                </div>

                                {/* Disponible */}
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="edit-is_available"
                                        name="is_available"
                                        defaultChecked={
                                            !!dishToEdit.is_available
                                        }
                                        value={1}
                                    />
                                    <Label
                                        htmlFor="edit-is_available"
                                        className="cursor-pointer"
                                    >
                                        Disponible
                                    </Label>
                                    <InputError message={errors.is_available} />
                                </div>

                                {/* Destacado */}
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="edit-is_featured"
                                        name="is_featured"
                                        defaultChecked={
                                            !!dishToEdit.is_featured
                                        }
                                        value={1}
                                    />
                                    <Label
                                        htmlFor="edit-is_featured"
                                        className="cursor-pointer"
                                    >
                                        Destacado
                                    </Label>
                                    <InputError message={errors.is_featured} />
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
