import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ReleaseActionStoreType = {
    action: RELEASE_DETAIL_ACTION;
    setAction: (action: RELEASE_DETAIL_ACTION) => void;
    lastPathAction: string | null;
    setLastPathAction: (action: string | null) => void;
    lastReleaseId: string | null;
    setLastReleaseId: (id: string | null) => void;
};

export const useReleaseActionStore = create<ReleaseActionStoreType>()(
    persist(
        (set) => ({
            action: RELEASE_DETAIL_ACTION.READ,
            setAction: (action) => set({ action }),
            lastPathAction: null,
            setLastPathAction: (lastPathAction) => set({ lastPathAction }),
            lastReleaseId: null,
            setLastReleaseId: (lastReleaseId) => set({ lastReleaseId }),
        }),
        {
            name: 'release-action',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
