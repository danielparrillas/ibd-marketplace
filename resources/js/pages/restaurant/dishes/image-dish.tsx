import DishController from '@/actions/App/Http/Controllers/DishController';
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
import { setDishToUploadImage, useDishesStore } from './dishesStore';

type Props = {
    children?: React.ReactNode;
};

function ImageDish({ children }: Props) {
    const dish = useDishesStore((state) => state.dishToUploadImage);

    return (
        <Sheet open={!!dish} onOpenChange={() => setDishToUploadImage(null)}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Configuración de Imagen</SheetTitle>
                    <SheetDescription>
                        Agrega o actualiza la imagen del platillo {dish?.name}.
                    </SheetDescription>
                </SheetHeader>
                <Form
                    {...DishController.uploadImage.form({
                        id: (dish?.id as number) || '',
                    })}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4 py-4"
                    onSuccess={() => setDishToUploadImage(null)}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                {dish?.image_url ? (
                                    <div className="flex flex-col gap-2">
                                        <Label>Imagen Actual</Label>
                                        <img
                                            src={dish.image_url}
                                            alt={dish.name}
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

export default ImageDish;
