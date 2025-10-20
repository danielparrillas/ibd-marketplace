import { DishTable } from '@/types/tables';
import { create } from 'zustand';

type DishIngredientStore = {
    openStoreDishIngredient: boolean;
    dishIngredientToEdit?: DishTable | null;
    dishIngredientToDelete?: DishTable | null;
};

export const useDishIngredientsStore = create<DishIngredientStore>()(
    (set, get) => ({
        openStoreDishIngredient: false,
    }),
);

export const setOpenStoreDishIngredient = (open: boolean) =>
    useDishIngredientsStore.setState({ openStoreDishIngredient: open });

export const setDishIngredientToEdit = (dishIngredient: DishTable | null) =>
    useDishIngredientsStore.setState({ dishIngredientToEdit: dishIngredient });

export const setDishIngredientToDelete = (dishIngredient: DishTable | null) =>
    useDishIngredientsStore.setState({
        dishIngredientToDelete: dishIngredient,
    });
