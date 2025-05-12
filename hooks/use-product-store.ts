import { create } from 'zustand';

interface ProductUpdateState {
    hasNewData: boolean;
    setHasNewData: (hasNewData: boolean) => void;
}

export const useProductUpdateStore = create<ProductUpdateState>((set) => ({
    hasNewData: false,
    setHasNewData: (hasNewData) => set({ hasNewData }),
}));
