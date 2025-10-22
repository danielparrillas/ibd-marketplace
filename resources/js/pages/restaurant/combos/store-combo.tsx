import ComboController from '@/actions/App/Http/Controllers/ComboController';
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
import { setOpenStoreCombo, useCombosStore } from './combosStore';

type Props = {
    children?: React.ReactNode;
};

function StoreCombo({ children }: Props) {
    const open = useCombosStore((state) => state.openStoreCombo);

    return (
        <Sheet open={open} onOpenChange={setOpenStoreCombo}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Agregar Combo</SheetTitle>
                    <SheetDescription>
                        Escribe los detalles del nuevo combo a continuación.
                    </SheetDescription>
                </SheetHeader>
                <Form
                    {...ComboController.store.form()}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4 py-4"
                    onSuccess={() => setOpenStoreCombo(false)}
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
                                        placeholder="Nombre del combo"
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
                                        placeholder="Descripción del combo"
                                        rows={3}
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                {/* Precio del Combo */}
                                <div className="grid gap-2">
                                    <Label htmlFor="combo_price">
                                        Precio del Combo *
                                    </Label>
                                    <Input
                                        id="combo_price"
                                        name="combo_price"
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                    />
                                    <InputError message={errors.combo_price} />
                                </div>

                                {/* URL de Imagen */}
                                <div className="grid gap-2">
                                    <Label htmlFor="image_url">Imagen</Label>
                                    <Input
                                        id="image_url"
                                        name="image_url"
                                        type="file"
                                        accept="image/*"
                                    />
                                    <InputError message={errors.image_url} />
                                </div>

                                {/* Válido Desde */}
                                <div className="grid gap-2">
                                    <Label htmlFor="valid_from">
                                        Válido Desde
                                    </Label>
                                    <Input
                                        id="valid_from"
                                        name="valid_from"
                                        type="date"
                                    />
                                    <InputError message={errors.valid_from} />
                                </div>

                                {/* Válido Hasta */}
                                <div className="grid gap-2">
                                    <Label htmlFor="valid_until">
                                        Válido Hasta
                                    </Label>
                                    <Input
                                        id="valid_until"
                                        name="valid_until"
                                        type="date"
                                    />
                                    <InputError message={errors.valid_until} />
                                </div>

                                {/* Disponible */}
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="is_available"
                                        name="is_available"
                                        defaultChecked={true}
                                        value={1}
                                    />
                                    <Label
                                        htmlFor="is_available"
                                        className="cursor-pointer"
                                    >
                                        Disponible
                                    </Label>
                                    <InputError message={errors.is_available} />
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

export default StoreCombo;
