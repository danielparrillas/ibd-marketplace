import { IngredientTable } from '@/types/tables';
import { create } from 'zustand';

type IngredientsStore = {
    openStoreIngredient: boolean;
    ingredientToEdit?: IngredientTable | null;
};

export const useIngredientsStore = create<IngredientsStore>()((set, get) => ({
    openStoreIngredient: false,
}));

export const setOpenStoreIngredient = (open: boolean) =>
    useIngredientsStore.setState({ openStoreIngredient: open });

export const setIngredientToEdit = (ingrediente: IngredientTable | null) =>
    useIngredientsStore.setState({ ingredientToEdit: ingrediente });
