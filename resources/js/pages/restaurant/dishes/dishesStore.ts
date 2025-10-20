import { DishTable } from '@/types/tables';
import { create } from 'zustand';

type DishesStore = {
    openStoreDish: boolean;
    dishToUploadImage?: DishTable | null;
    dishToEdit?: DishTable | null;
    dishToDelete?: DishTable | null;
};

export const useDishesStore = create<DishesStore>()((set, get) => ({
    openStoreDish: false,
}));

export const setOpenStoreDish = (open: boolean) =>
    useDishesStore.setState({ openStoreDish: open });

export const setDishToEdit = (dish: DishTable | null) =>
    useDishesStore.setState({ dishToEdit: dish });

export const setDishToDelete = (dish: DishTable | null) =>
    useDishesStore.setState({ dishToDelete: dish });

export const setDishToUploadImage = (dish: DishTable | null) =>
    useDishesStore.setState({ dishToUploadImage: dish });
