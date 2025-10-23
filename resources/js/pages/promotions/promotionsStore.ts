import { PromotionTable } from '@/types/tables';
import { create } from 'zustand';

type PromotionsStore = {
    openStorePromotion: boolean;
    promotionToEdit?: PromotionTable | null;
    promotionToDelete?: PromotionTable | null;
};

export const usePromotionsStore = create<PromotionsStore>()((set, get) => ({
    openStorePromotion: false,
}));

export const setOpenStorePromotion = (open: boolean) =>
    usePromotionsStore.setState({ openStorePromotion: open });

export const setPromotionToEdit = (promotion: PromotionTable | null) =>
    usePromotionsStore.setState({ promotionToEdit: promotion });

export const setPromotionToDelete = (promotion: PromotionTable | null) =>
    usePromotionsStore.setState({ promotionToDelete: promotion });
