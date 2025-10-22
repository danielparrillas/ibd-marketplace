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
} from '@/components/ui/sheet';
import { Form } from '@inertiajs/react';
import { useEffect } from 'react';
import { setComboDishToEdit, useComboDishesStore } from './comboDishesStore';

export default function EditComboDish() {
    const comboDish = useComboDishesStore((state) => state.comboDishToEdit);
    const open = !!comboDish;

    useEffect(() => {
        if (!open) {
            // Reset form when closed
            setComboDishToEdit(null);
        }
    }, [open]);

    if (!comboDish) {
        return null;
    }

    return (
        <Sheet
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setComboDishToEdit(null);
                }
            }}
        >
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Editar platillo del combo</SheetTitle>
                    <SheetDescription>
                        Actualiza la cantidad del platillo{' '}
                        <strong>{comboDish.dish.name}.</strong>
                    </SheetDescription>
                </SheetHeader>
                <Form
                    {...ComboDishController.update.form({
                        comboId: comboDish.combo_id,
                        dish: comboDish.id,
                    })}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4 py-4"
                    onSuccess={() => setComboDishToEdit(null)}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                {/* Cantidad */}
                                <div className="grid gap-2">
                                    <Label htmlFor="quantity">Cantidad *</Label>
                                    <Input
                                        id="quantity"
                                        name="quantity"
                                        type="number"
                                        min={1}
                                        step="1"
                                        defaultValue={comboDish.quantity}
                                    />
                                    <InputError message={errors.quantity} />
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
