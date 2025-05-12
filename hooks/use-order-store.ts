import { create } from 'zustand';

interface NewDataStore {
    hasNewData: boolean;
    lastUpdatedTime: Date | number;
    setHasNewData: (value: boolean) => void;
}

export const useOrderUpdateStore = create<NewDataStore>((set) => ({
    hasNewData: false,
    lastUpdatedTime: 0,
    setHasNewData: (value: boolean) => set({ hasNewData: value }),
}));
