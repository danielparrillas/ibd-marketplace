import { ComboTable } from '@/types/tables';
import { create } from 'zustand';

type CombosStore = {
    openStoreCombo: boolean;
    comboToUploadImage?: ComboTable | null;
    comboToEdit?: ComboTable | null;
    comboToDelete?: ComboTable | null;
};

export const useCombosStore = create<CombosStore>()((set, get) => ({
    openStoreCombo: false,
}));

export const setOpenStoreCombo = (open: boolean) =>
    useCombosStore.setState({ openStoreCombo: open });

export const setComboToEdit = (combo: ComboTable | null) =>
    useCombosStore.setState({ comboToEdit: combo });

export const setComboToDelete = (combo: ComboTable | null) =>
    useCombosStore.setState({ comboToDelete: combo });

export const setComboToUploadImage = (combo: ComboTable | null) =>
    useCombosStore.setState({ comboToUploadImage: combo });
