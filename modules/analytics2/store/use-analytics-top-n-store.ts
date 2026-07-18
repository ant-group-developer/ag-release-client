import { create } from 'zustand';

interface AnalyticsTopNStore {
    topN: number;
    setTopN: (topN: number) => void;
}

export const useAnalyticsTopNStore = create<AnalyticsTopNStore>((set) => ({
    topN: 5,
    setTopN: (topN) => set({ topN }),
}));
