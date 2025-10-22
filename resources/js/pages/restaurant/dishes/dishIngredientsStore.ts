import { DishIngredientTable, IngredientTable } from '@/types/tables';
import { create } from 'zustand';

type DishIngredientStore = {
    openStoreDishIngredient: boolean;
    dishIngredientToEdit?:
        | (DishIngredientTable & { ingredient: IngredientTable })
        | null;
    dishIngredientToDelete?:
        | (DishIngredientTable & { ingredient: IngredientTable })
        | null;
};

export const useDishIngredientsStore = create<DishIngredientStore>()(
    (set, get) => ({
        openStoreDishIngredient: false,
    }),
);

export const setOpenStoreDishIngredient = (open: boolean) =>
    useDishIngredientsStore.setState({ openStoreDishIngredient: open });

export const setDishIngredientToEdit = (
    dishIngredient:
        | (DishIngredientTable & { ingredient: IngredientTable })
        | null,
) => useDishIngredientsStore.setState({ dishIngredientToEdit: dishIngredient });

export const setDishIngredientToDelete = (
    dishIngredient:
        | (DishIngredientTable & { ingredient: IngredientTable })
        | null,
) =>
    useDishIngredientsStore.setState({
        dishIngredientToDelete: dishIngredient,
    });
