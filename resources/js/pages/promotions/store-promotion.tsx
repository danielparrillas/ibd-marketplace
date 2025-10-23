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
    SheetTrigger,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { DishTable, RestaurantTable } from '@/types/tables';
import { Form, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { setOpenStorePromotion, usePromotionsStore } from './promotionsStore';

type Props = {
    children?: React.ReactNode;
};

function StorePromotion({ children }: Props) {
    const open = usePromotionsStore((state) => state.openStorePromotion);
    const restaurant = usePage().props.restaurant as RestaurantTable;
    const dishes = (usePage().props.dishes as DishTable[]) || [];

    const [promotionType, setPromotionType] = useState<string>('percentage');
    const [appliesTo, setAppliesTo] = useState<string>('all');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedDishes, setSelectedDishes] = useState<number[]>([]);

    // Obtener categorías únicas de los platos
    const categories = Array.from(
        new Set(dishes.map((dish) => dish.category)),
    ).filter(Boolean);

    return (
        <Sheet open={open} onOpenChange={setOpenStorePromotion}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Agregar Promoción</SheetTitle>
                    <SheetDescription>
                        Escribe los detalles de la nueva promoción a
                        continuación.
                    </SheetDescription>
                </SheetHeader>
                <Form
                    {...PromotionController.store.form()}
                    disableWhileProcessing
                    className="flex flex-col gap-6 px-4 py-4"
                    onSuccess={() => setOpenStorePromotion(false)}
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                {/* Restaurant ID (hidden) */}
                                <input
                                    type="hidden"
                                    name="restaurant_id"
                                    value={restaurant?.id || ''}
                                />

                                {/* Nombre */}
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nombre *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="Nombre de la promoción"
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
                                        placeholder="Descripción de la promoción"
                                        rows={3}
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                {/* Tipo de Promoción */}
                                <div className="grid gap-2">
                                    <Label htmlFor="promotion_type">
                                        Tipo de Promoción *
                                    </Label>
                                    <select
                                        id="promotion_type"
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
                                    <Label htmlFor="discount_value">
                                        {promotionType === 'percentage'
                                            ? 'Porcentaje de Descuento (%)'
                                            : promotionType === 'fixedamount'
                                              ? 'Monto de Descuento ($)'
                                              : 'Cantidad'}{' '}
                                        *
                                    </Label>
                                    <Input
                                        id="discount_value"
                                        name="discount_value"
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                    />
                                    <InputError
                                        message={errors.discount_value}
                                    />
                                </div>

                                {/* Monto Mínimo de Orden */}
                                <div className="grid gap-2">
                                    <Label htmlFor="min_order_amount">
                                        Monto Mínimo de Orden ($)
                                    </Label>
                                    <Input
                                        id="min_order_amount"
                                        name="min_order_amount"
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        placeholder="0.00"
                                    />
                                    <InputError
                                        message={errors.min_order_amount}
                                    />
                                </div>

                                {/* Descuento Máximo */}
                                {promotionType === 'percentage' && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="max_discount">
                                            Descuento Máximo ($)
                                        </Label>
                                        <Input
                                            id="max_discount"
                                            name="max_discount"
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            placeholder="0.00"
                                        />
                                        <InputError
                                            message={errors.max_discount}
                                        />
                                    </div>
                                )}

                                {/* Aplica A */}
                                <div className="grid gap-2">
                                    <Label htmlFor="applies_to">
                                        Aplica A *
                                    </Label>
                                    <select
                                        id="applies_to"
                                        name="applies_to"
                                        required
                                        className="rounded-md border border-gray-300 px-3 py-2"
                                        value={appliesTo}
                                        onChange={(e) =>
                                            setAppliesTo(e.target.value)
                                        }
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
                                                            {dish.price}
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
                                    <Label htmlFor="valid_from">
                                        Válido Desde *
                                    </Label>
                                    <Input
                                        id="valid_from"
                                        name="valid_from"
                                        type="datetime-local"
                                        required
                                    />
                                    <InputError message={errors.valid_from} />
                                </div>

                                {/* Fecha de Fin */}
                                <div className="grid gap-2">
                                    <Label htmlFor="valid_until">
                                        Válido Hasta *
                                    </Label>
                                    <Input
                                        id="valid_until"
                                        name="valid_until"
                                        type="datetime-local"
                                        required
                                    />
                                    <InputError message={errors.valid_until} />
                                </div>

                                {/* Límite de Uso */}
                                <div className="grid gap-2">
                                    <Label htmlFor="usage_limit">
                                        Límite de Uso
                                    </Label>
                                    <Input
                                        id="usage_limit"
                                        name="usage_limit"
                                        type="number"
                                        min={1}
                                        placeholder="Ilimitado"
                                    />
                                    <InputError message={errors.usage_limit} />
                                </div>

                                {/* Está Activa */}
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="is_active"
                                        name="is_active"
                                        defaultChecked
                                    />
                                    <Label
                                        htmlFor="is_active"
                                        className="cursor-pointer"
                                    >
                                        Activar promoción
                                    </Label>
                                    <InputError message={errors.is_active} />
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

export default StorePromotion;
