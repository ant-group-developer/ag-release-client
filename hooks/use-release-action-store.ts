import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { create } from 'zustand';

type ReleaseActionStoreType = {
    action: RELEASE_DETAIL_ACTION;
    setAction: (action: RELEASE_DETAIL_ACTION) => void;
};

export const useReleaseActionStore = create<ReleaseActionStoreType>((set) => ({
    action: RELEASE_DETAIL_ACTION.READ,
    setAction: (action) => set({ action }),
}));
