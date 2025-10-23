import PromotionController from '@/actions/App/Http/Controllers/PromotionController';
import { Button } from '@/components/ui/button';
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
import { AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
import { setPromotionToDelete, usePromotionsStore } from './promotionsStore';

export default function DeletePromotion() {
    const promotionToDelete = usePromotionsStore(
        (state) => state.promotionToDelete,
    );
    const open = !!promotionToDelete;

    useEffect(() => {
        if (!open) {
            setPromotionToDelete(null);
        }
    }, [open]);

    if (!promotionToDelete) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const promotionType = {
        percentage: 'Porcentaje',
        fixedamount: 'Monto Fijo',
        buyxgety: 'Compra X Lleva Y',
    }[promotionToDelete.promotion_type];

    const appliesTo = {
        all: 'Todos los Platos',
        category: 'Categoría Específica',
        specificdishes: 'Platos Específicos',
    }[promotionToDelete.applies_to];

    return (
        <Sheet
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) setPromotionToDelete(null);
            }}
        >
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Eliminar Promoción
                    </SheetTitle>
                    <SheetDescription>
                        Esta acción no se puede deshacer.
                    </SheetDescription>
                </SheetHeader>
                <Form
                    {...PromotionController.destroy.form(promotionToDelete.id)}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4 py-6"
                    onSuccess={() => setPromotionToDelete(null)}
                >
                    {({ processing }) => (
                        <>
                            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                                <p className="text-sm text-foreground">
                                    ¿Estás seguro de que deseas eliminar la
                                    promoción{' '}
                                    <strong className="font-semibold">
                                        {promotionToDelete.name}
                                    </strong>
                                    ?
                                </p>
                                {promotionToDelete.usage_count > 0 ? (
                                    <p className="mt-2 text-sm font-medium text-destructive">
                                        ⚠️ Esta promoción ha sido utilizada{' '}
                                        {promotionToDelete.usage_count}{' '}
                                        vez(veces) y no podrá ser eliminada.
                                    </p>
                                ) : (
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Se eliminarán todos los datos asociados
                                        a esta promoción.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
                                <h4 className="text-sm font-medium">
                                    Información de la promoción:
                                </h4>
                                <dl className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Nombre:
                                        </dt>
                                        <dd className="font-medium">
                                            {promotionToDelete.name}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Tipo:
                                        </dt>
                                        <dd className="font-medium">
                                            {promotionType}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Descuento:
                                        </dt>
                                        <dd className="font-medium">
                                            {promotionToDelete.promotion_type ===
                                            'percentage'
                                                ? `${promotionToDelete.discount_value}%`
                                                : `$${promotionToDelete.discount_value.toFixed(2)}`}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Aplica a:
                                        </dt>
                                        <dd className="font-medium">
                                            {appliesTo}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Válido hasta:
                                        </dt>
                                        <dd className="font-medium">
                                            {formatDate(
                                                promotionToDelete.valid_until,
                                            )}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Veces utilizada:
                                        </dt>
                                        <dd
                                            className={`font-medium ${promotionToDelete.usage_count > 0 ? 'text-destructive' : ''}`}
                                        >
                                            {promotionToDelete.usage_count}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">
                                            Estado:
                                        </dt>
                                        <dd className="font-medium">
                                            {promotionToDelete.is_active
                                                ? 'Activa'
                                                : 'Inactiva'}
                                        </dd>
                                    </div>
                                </dl>
                            </div>

                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={processing}
                                    >
                                        Cancelar
                                    </Button>
                                </SheetClose>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={
                                        processing ||
                                        promotionToDelete.usage_count > 0
                                    }
                                >
                                    {processing ? 'Eliminando...' : 'Eliminar'}
                                </Button>
                            </SheetFooter>
                        </>
                    )}
                </Form>
            </SheetContent>
        </Sheet>
    );
}
