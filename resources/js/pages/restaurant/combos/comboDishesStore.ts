import { ComboDishTable, DishTable } from '@/types/tables';
import { create } from 'zustand';

type ComboDishStore = {
    openStoreComboDish: boolean;
    comboDishToEdit?: (ComboDishTable & { dish: DishTable }) | null;
    comboDishToDelete?: (ComboDishTable & { dish: DishTable }) | null;
};

export const useComboDishesStore = create<ComboDishStore>()((set, get) => ({
    openStoreComboDish: false,
}));

export const setOpenStoreComboDish = (open: boolean) =>
    useComboDishesStore.setState({ openStoreComboDish: open });

export const setComboDishToEdit = (
    comboDish: (ComboDishTable & { dish: DishTable }) | null,
) => useComboDishesStore.setState({ comboDishToEdit: comboDish });

export const setComboDishToDelete = (
    comboDish: (ComboDishTable & { dish: DishTable }) | null,
) =>
    useComboDishesStore.setState({
        comboDishToDelete: comboDish,
    });
