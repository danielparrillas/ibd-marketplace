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
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Form } from '@inertiajs/react';
import { useEffect } from 'react';
import { setComboToEdit, useCombosStore } from './combosStore';

export default function EditCombo() {
    const comboToEdit = useCombosStore((state) => state.comboToEdit);
    const open = !!comboToEdit;

    useEffect(() => {
        if (!open) {
            // Reset form when closed
            setComboToEdit(null);
        }
    }, [open]);

    if (!comboToEdit) {
        return null;
    }

    return (
        <Sheet
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setComboToEdit(null);
                }
            }}
        >
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Editar Combo</SheetTitle>
                    <SheetDescription>
                        Actualiza los detalles del combo a continuación.
                    </SheetDescription>
                </SheetHeader>
                <Form
                    {...ComboController.update.form(comboToEdit.id)}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4 py-4"
                    onSuccess={() => setComboToEdit(null)}
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
                                        defaultValue={comboToEdit.name}
                                        placeholder="Nombre del combo"
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
                                            comboToEdit.description ?? ''
                                        }
                                        placeholder="Descripción del combo"
                                        rows={3}
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                {/* Precio del Combo */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-combo_price">
                                        Precio del Combo *
                                    </Label>
                                    <Input
                                        id="edit-combo_price"
                                        name="combo_price"
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        required
                                        defaultValue={comboToEdit.combo_price}
                                        placeholder="0.00"
                                    />
                                    <InputError message={errors.combo_price} />
                                </div>

                                {/* Válido Desde */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-valid_from">
                                        Válido Desde
                                    </Label>
                                    <Input
                                        id="edit-valid_from"
                                        name="valid_from"
                                        type="date"
                                        defaultValue={
                                            comboToEdit.valid_from ?? ''
                                        }
                                    />
                                    <InputError message={errors.valid_from} />
                                </div>

                                {/* Válido Hasta */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-valid_until">
                                        Válido Hasta
                                    </Label>
                                    <Input
                                        id="edit-valid_until"
                                        name="valid_until"
                                        type="date"
                                        defaultValue={
                                            comboToEdit.valid_until ?? ''
                                        }
                                    />
                                    <InputError message={errors.valid_until} />
                                </div>

                                {/* Disponible */}
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="edit-is_available"
                                        name="is_available"
                                        defaultChecked={
                                            !!comboToEdit.is_available
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
