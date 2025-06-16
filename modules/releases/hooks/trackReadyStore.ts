import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TrackReadyState {
    trackReadyMap: Record<string, boolean>;
    setTrackReadyMap: (trackId: string, isReady: boolean) => void;
    resetTrackReadyMap: () => void;
}

export const useTrackReadyStore = create<TrackReadyState>()(
    persist(
        (set) => ({
            trackReadyMap: {},
            setTrackReadyMap: (trackId, isReady) =>
                set((state) => ({
                    trackReadyMap: {
                        ...state.trackReadyMap,
                        [trackId]: isReady,
                    },
                })),
            resetTrackReadyMap: () => set({ trackReadyMap: {} }),
        }),
        {
            name: 'track-ready-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
