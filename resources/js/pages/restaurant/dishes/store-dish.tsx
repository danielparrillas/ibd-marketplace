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
    SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Form } from '@inertiajs/react';
import { setOpenStoreDish, useDishesStore } from './dishesStore';

type Props = {
    children?: React.ReactNode;
};

function StoreDish({ children }: Props) {
    const open = useDishesStore((state) => state.openStoreDish);

    return (
        <Sheet open={open} onOpenChange={setOpenStoreDish}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Agregar Platillo</SheetTitle>
                    <SheetDescription>
                        Escribe los detalles del nuevo platillo a continuación.
                    </SheetDescription>
                </SheetHeader>
                <Form
                    {...DishController.store.form()}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4 py-4"
                    onSuccess={() => setOpenStoreDish(false)}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                {/* Nombre */}
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nombre *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="Nombre del platillo"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* Descripción */}
                                <div className="grid gap-2">
                                    <Label htmlFor="description">
                                        Descripción
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Descripción del platillo"
                                        rows={3}
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                {/* Precio */}
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Precio *</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                    />
                                    <InputError message={errors.price} />
                                </div>

                                {/* Categoría */}
                                <div className="grid gap-2">
                                    <Label htmlFor="category">
                                        Categoría *
                                    </Label>
                                    <Input
                                        id="category"
                                        name="category"
                                        type="text"
                                        required
                                        placeholder="Ej. Entradas, Platos fuertes, Postres"
                                        list="category-options"
                                    />
                                    <InputError message={errors.category} />
                                    <datalist id="category-options">
                                        <option value="Entradas" />
                                        <option value="Platos fuertes" />
                                        <option value="Postres" />
                                        <option value="Bebidas" />
                                        <option value="Ensaladas" />
                                        <option value="Sopas" />
                                    </datalist>
                                </div>

                                {/* URL de Imagen */}
                                <div className="grid gap-2">
                                    <Label htmlFor="image_url">
                                        URL de Imagen
                                    </Label>
                                    <Input
                                        id="image_url"
                                        name="image_url"
                                        type="file"
                                        accept="image/*"
                                    />
                                    <InputError message={errors.image_url} />
                                </div>

                                {/* Tiempo de Preparación */}
                                <div className="grid gap-2">
                                    <Label htmlFor="preparation_time">
                                        Tiempo de Preparación (min) *
                                    </Label>
                                    <Input
                                        id="preparation_time"
                                        name="preparation_time"
                                        type="number"
                                        min={0}
                                        required
                                        placeholder="0"
                                    />
                                    <InputError
                                        message={errors.preparation_time}
                                    />
                                </div>

                                {/* Calorías */}
                                <div className="grid gap-2">
                                    <Label htmlFor="calories">
                                        Calorías (kcal)
                                    </Label>
                                    <Input
                                        id="calories"
                                        name="calories"
                                        type="number"
                                        min={0}
                                        placeholder="0"
                                    />
                                    <InputError message={errors.calories} />
                                </div>

                                {/* Alérgenos */}
                                <div className="grid gap-2">
                                    <Label htmlFor="allergens">Alérgenos</Label>
                                    <Input
                                        id="allergens"
                                        name="allergens"
                                        type="text"
                                        placeholder="Ej. Gluten, Lactosa, Frutos secos"
                                    />
                                    <InputError message={errors.allergens} />
                                </div>

                                {/* Disponible */}
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="is_available"
                                        name="is_available"
                                        defaultChecked={true}
                                        value={1}
                                    />
                                    {/* <input
                                        type="hidden"
                                        name="is_available"
                                        value="0"
                                    /> */}
                                    <Label
                                        htmlFor="is_available"
                                        className="cursor-pointer"
                                    >
                                        Disponible
                                    </Label>
                                    <InputError message={errors.is_available} />
                                </div>

                                {/* Destacado */}
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="is_featured"
                                        name="is_featured"
                                        defaultChecked={false}
                                        value={1}
                                    />
                                    {/* <input
                                        type="hidden"
                                        name="is_featured"
                                        value="0"
                                    /> */}
                                    <Label
                                        htmlFor="is_featured"
                                        className="cursor-pointer"
                                    >
                                        Destacado
                                    </Label>
                                    <InputError message={errors.is_featured} />
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

export default StoreDish;
