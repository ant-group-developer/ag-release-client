import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { create } from 'zustand';

interface ReleaseActionStore {
    action: RELEASE_DETAIL_ACTION;
    setAction: (action: RELEASE_DETAIL_ACTION) => void;
}

export const useReleaseDetailActionStore = create<ReleaseActionStore>(
    (set, get) => ({
        action: RELEASE_DETAIL_ACTION.READ,
        setAction: (action: RELEASE_DETAIL_ACTION) => {
            set({ action });
        },
    })
);
