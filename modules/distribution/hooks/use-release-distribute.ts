import { ReleaseDspData } from '@/modules/release-dsp/types';
import { create } from 'zustand';

interface ReleaseDistributeState {
    selectedRows: ReleaseDspData[];
    setSelectedRows: (rows: ReleaseDspData[]) => void;
}

export const useReleaseDistribute = create<ReleaseDistributeState>((set) => ({
    selectedRows: [],
    setSelectedRows: (rows) => set({ selectedRows: rows }),
}));
