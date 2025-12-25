import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ReleaseActionStoreType = {
    action: RELEASE_DETAIL_ACTION;
    setAction: (action: RELEASE_DETAIL_ACTION) => void;
};

export const useReleaseActionStore = create<ReleaseActionStoreType>()(
    persist(
        (set) => ({
            action: RELEASE_DETAIL_ACTION.READ,
            setAction: (action) => set({ action }),
        }),
        {
            name: 'release-action',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
