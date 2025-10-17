import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type IngredientsStore = {
    openStoreIngredient: boolean;
};

export const useIngredientsStore = create<IngredientsStore>()(
    persist(
        (set, get) => ({
            openStoreIngredient: false,
        }),
        {
            name: 'ingredients-storage',
        },
    ),
);

export const setOpenStoreIngredient = (open: boolean) =>
    useIngredientsStore.setState({ openStoreIngredient: open });
