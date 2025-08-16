import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ReleaseActionStore {
    action: RELEASE_DETAIL_ACTION;
    setAction: (action: RELEASE_DETAIL_ACTION) => void;
}

export const useReleaseDetailActionStore = create<ReleaseActionStore>()(
    persist(
        (set) => ({
            action: RELEASE_DETAIL_ACTION.READ,
            setAction: (action) => set({ action }),
        }),
        {
            name: 'release-detail-action',
            storage: createJSONStorage(() => sessionStorage), // dùng sessionStorage
            partialize: (state) => ({ action: state.action }), // chỉ lưu field cần thiết
            version: 1,
        }
    )
);
