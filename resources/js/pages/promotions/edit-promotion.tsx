import PromotionController from '@/actions/App/Http/Controllers/PromotionController';
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
import { DishTable } from '@/types/tables';
import { Form, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { setPromotionToEdit, usePromotionsStore } from './promotionsStore';

export default function EditPromotion() {
    const promotionToEdit = usePromotionsStore(
        (state) => state.promotionToEdit,
    );
    const open = !!promotionToEdit;
    const dishes = (usePage().props.dishes as DishTable[]) || [];

    const [promotionType, setPromotionType] = useState<string>('percentage');
    const [appliesTo, setAppliesTo] = useState<string>('all');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedDishes, setSelectedDishes] = useState<number[]>([]);

    // Obtener categorías únicas de los platos
    const categories = Array.from(
        new Set(dishes.map((dish) => dish.category)),
    ).filter(Boolean);

    useEffect(() => {
        if (promotionToEdit) {
            // Inicializar estados con los valores de la promoción
            setPromotionType(promotionToEdit.promotion_type);
            setAppliesTo(promotionToEdit.applies_to);

            // Parsear target_categories si existe
            if (promotionToEdit.target_categories) {
                setSelectedCategories(
                    promotionToEdit.target_categories
                        .split(',')
                        .map((c) => c.trim()),
                );
            } else {
                setSelectedCategories([]);
            }

            // Parsear target_dish_ids si existe
            if (promotionToEdit.target_dish_ids) {
                setSelectedDishes(
                    promotionToEdit.target_dish_ids
                        .split(',')
                        .map((id) => parseInt(id.trim())),
                );
            } else {
                setSelectedDishes([]);
            }
        }
    }, [promotionToEdit]);

    useEffect(() => {
        if (!open) {
            // Reset form when closed
            setPromotionToEdit(null);
            setPromotionType('percentage');
            setAppliesTo('all');
            setSelectedCategories([]);
            setSelectedDishes([]);
        }
    }, [open]);

    if (!promotionToEdit) {
        return null;
    }

    // Formatear fechas para datetime-local input
    const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return (
        <Sheet
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setPromotionToEdit(null);
                }
            }}
        >
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Editar Promoción</SheetTitle>
                    <SheetDescription>
                        Actualiza los detalles de la promoción a continuación.
                    </SheetDescription>
                </SheetHeader>
                <Form
                    {...PromotionController.update.form(promotionToEdit.id)}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4 py-4"
                    onSuccess={() => setPromotionToEdit(null)}
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
                                        defaultValue={promotionToEdit.name}
                                        placeholder="Nombre de la promoción"
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
                                            promotionToEdit.description ?? ''
                                        }
                                        placeholder="Descripción de la promoción"
                                        rows={3}
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                {/* Tipo de Promoción */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-promotion_type">
                                        Tipo de Promoción *
                                    </Label>
                                    <select
                                        id="edit-promotion_type"
                                        name="promotion_type"
                                        required
                                        className="rounded-md border border-gray-300 px-3 py-2"
                                        value={promotionType}
                                        onChange={(e) =>
                                            setPromotionType(e.target.value)
                                        }
                                    >
                                        <option value="percentage">
                                            Porcentaje
                                        </option>
                                        <option value="fixedamount">
                                            Monto Fijo
                                        </option>
                                        <option value="buyxgety">
                                            Compra X Lleva Y
                                        </option>
                                    </select>
                                    <InputError
                                        message={errors.promotion_type}
                                    />
                                </div>

                                {/* Valor de Descuento */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-discount_value">
                                        {promotionType === 'percentage'
                                            ? 'Porcentaje de Descuento (%)'
                                            : promotionType === 'fixedamount'
                                              ? 'Monto de Descuento ($)'
                                              : 'Cantidad'}{' '}
                                        *
                                    </Label>
                                    <Input
                                        id="edit-discount_value"
                                        name="discount_value"
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        required
                                        defaultValue={
                                            promotionToEdit.discount_value
                                        }
                                        placeholder="0.00"
                                    />
                                    <InputError
                                        message={errors.discount_value}
                                    />
                                </div>

                                {/* Monto Mínimo de Orden */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-min_order_amount">
                                        Monto Mínimo de Orden ($)
                                    </Label>
                                    <Input
                                        id="edit-min_order_amount"
                                        name="min_order_amount"
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        defaultValue={
                                            promotionToEdit.min_order_amount ??
                                            ''
                                        }
                                        placeholder="0.00"
                                    />
                                    <InputError
                                        message={errors.min_order_amount}
                                    />
                                </div>

                                {/* Descuento Máximo */}
                                {promotionType === 'percentage' && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-max_discount">
                                            Descuento Máximo ($)
                                        </Label>
                                        <Input
                                            id="edit-max_discount"
                                            name="max_discount"
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            defaultValue={
                                                promotionToEdit.max_discount ??
                                                ''
                                            }
                                            placeholder="0.00"
                                        />
                                        <InputError
                                            message={errors.max_discount}
                                        />
                                    </div>
                                )}

                                {/* Aplica A */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-applies_to">
                                        Aplica A *
                                    </Label>
                                    <select
                                        id="edit-applies_to"
                                        name="applies_to"
                                        required
                                        className="rounded-md border border-gray-300 px-3 py-2"
                                        value={appliesTo}
                                        onChange={(e) => {
                                            setAppliesTo(e.target.value);
                                            // Limpiar selecciones al cambiar
                                            if (e.target.value === 'all') {
                                                setSelectedCategories([]);
                                                setSelectedDishes([]);
                                            }
                                        }}
                                    >
                                        <option value="all">
                                            Todos los Platos
                                        </option>
                                        <option value="category">
                                            Categoría Específica
                                        </option>
                                        <option value="specificdishes">
                                            Platos Específicos
                                        </option>
                                    </select>
                                    <InputError message={errors.applies_to} />
                                </div>

                                {/* Categorías Objetivo */}
                                {appliesTo === 'category' && (
                                    <div className="grid gap-2">
                                        <Label>Categorías *</Label>
                                        <div className="space-y-2 rounded-md border border-gray-300 p-3">
                                            {categories.length > 0 ? (
                                                categories.map((category) => (
                                                    <div
                                                        key={category}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            name="target_categories[]"
                                                            value={category}
                                                            checked={selectedCategories.includes(
                                                                category,
                                                            )}
                                                            onChange={(e) => {
                                                                if (
                                                                    e.target
                                                                        .checked
                                                                ) {
                                                                    setSelectedCategories(
                                                                        [
                                                                            ...selectedCategories,
                                                                            category,
                                                                        ],
                                                                    );
                                                                } else {
                                                                    setSelectedCategories(
                                                                        selectedCategories.filter(
                                                                            (
                                                                                c,
                                                                            ) =>
                                                                                c !==
                                                                                category,
                                                                        ),
                                                                    );
                                                                }
                                                            }}
                                                            className="rounded"
                                                        />
                                                        <label>
                                                            {category}
                                                        </label>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-500">
                                                    No hay categorías
                                                    disponibles
                                                </p>
                                            )}
                                        </div>
                                        <InputError
                                            message={errors.target_categories}
                                        />
                                    </div>
                                )}

                                {/* Platos Objetivo */}
                                {appliesTo === 'specificdishes' && (
                                    <div className="grid gap-2">
                                        <Label>Platos Específicos *</Label>
                                        <div className="max-h-60 space-y-2 overflow-y-auto rounded-md border border-gray-300 p-3">
                                            {dishes.length > 0 ? (
                                                dishes.map((dish) => (
                                                    <div
                                                        key={dish.id}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            name="target_dish_ids[]"
                                                            value={dish.id}
                                                            checked={selectedDishes.includes(
                                                                dish.id,
                                                            )}
                                                            onChange={(e) => {
                                                                if (
                                                                    e.target
                                                                        .checked
                                                                ) {
                                                                    setSelectedDishes(
                                                                        [
                                                                            ...selectedDishes,
                                                                            dish.id,
                                                                        ],
                                                                    );
                                                                } else {
                                                                    setSelectedDishes(
                                                                        selectedDishes.filter(
                                                                            (
                                                                                id,
                                                                            ) =>
                                                                                id !==
                                                                                dish.id,
                                                                        ),
                                                                    );
                                                                }
                                                            }}
                                                            className="rounded"
                                                        />
                                                        <label className="text-sm">
                                                            {dish.name} - $
                                                            {dish.price.toFixed(
                                                                2,
                                                            )}
                                                        </label>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-500">
                                                    No hay platos disponibles
                                                </p>
                                            )}
                                        </div>
                                        <InputError
                                            message={errors.target_dish_ids}
                                        />
                                    </div>
                                )}

                                {/* Fecha de Inicio */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-valid_from">
                                        Válido Desde *
                                    </Label>
                                    <Input
                                        id="edit-valid_from"
                                        name="valid_from"
                                        type="datetime-local"
                                        required
                                        defaultValue={formatDateForInput(
                                            promotionToEdit.valid_from,
                                        )}
                                    />
                                    <InputError message={errors.valid_from} />
                                </div>

                                {/* Fecha de Fin */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-valid_until">
                                        Válido Hasta *
                                    </Label>
                                    <Input
                                        id="edit-valid_until"
                                        name="valid_until"
                                        type="datetime-local"
                                        required
                                        defaultValue={formatDateForInput(
                                            promotionToEdit.valid_until,
                                        )}
                                    />
                                    <InputError message={errors.valid_until} />
                                </div>

                                {/* Límite de Uso */}
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-usage_limit">
                                        Límite de Uso
                                    </Label>
                                    <Input
                                        id="edit-usage_limit"
                                        name="usage_limit"
                                        type="number"
                                        min={1}
                                        defaultValue={
                                            promotionToEdit.usage_limit ?? ''
                                        }
                                        placeholder="Ilimitado"
                                    />
                                    <InputError message={errors.usage_limit} />
                                </div>

                                {/* Está Activa */}
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="edit-is_active"
                                        name="is_active"
                                        defaultChecked={
                                            !!promotionToEdit.is_active
                                        }
                                        value={1}
                                    />
                                    <Label
                                        htmlFor="edit-is_active"
                                        className="cursor-pointer"
                                    >
                                        Activar promoción
                                    </Label>
                                    <InputError message={errors.is_active} />
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
