import ComboController from '@/actions/App/Http/Controllers/ComboController';
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
import { setComboToUploadImage, useCombosStore } from './combosStore';

type Props = {
    children?: React.ReactNode;
};

function ImageCombo({ children }: Props) {
    const combo = useCombosStore((state) => state.comboToUploadImage);

    return (
        <Sheet open={!!combo} onOpenChange={() => setComboToUploadImage(null)}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Configuración de Imagen</SheetTitle>
                    <SheetDescription>
                        Agrega o actualiza la imagen del combo {combo?.name}.
                    </SheetDescription>
                </SheetHeader>
                <Form
                    {...ComboController.uploadImage.form({
                        id: (combo?.id as number) || '',
                    })}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4 py-4"
                    onSuccess={() => setComboToUploadImage(null)}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                {combo?.image_url ? (
                                    <div className="flex flex-col gap-2">
                                        <Label>Imagen Actual</Label>
                                        <img
                                            src={combo.image_url}
                                            alt={combo.name}
                                            className="mx-auto h-32 w-32 rounded-md border-2 object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <Label>Imagen Actual</Label>
                                        <div className="rounded-d mx-auto flex h-32 w-32 items-center justify-center rounded-md border-2 border-dashed bg-muted text-center text-muted-foreground">
                                            Sin imagen
                                        </div>
                                    </div>
                                )}
                                {/* URL de Imagen */}
                                <div className="grid gap-2">
                                    <Label htmlFor="image_url">
                                        Cambiar Imagen
                                    </Label>
                                    <Input
                                        required
                                        id="image_url"
                                        name="image_url"
                                        type="file"
                                        accept="image/*"
                                    />
                                    <InputError message={errors.image_url} />
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

export default ImageCombo;
