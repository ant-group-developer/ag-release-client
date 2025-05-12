import { LAYOUT_TABLE, LOCAL_STORAGE_KEY } from '@/enums/common';
import { create } from 'zustand';

export const useTableLayoutToggle = create<{
    layoutTable: LAYOUT_TABLE;
    toggleLayoutTable: () => void;
}>((set) => ({
    layoutTable:
        typeof window !== 'undefined'
            ? (localStorage.getItem(
                  LOCAL_STORAGE_KEY.LAYOUT_TABLE
              ) as LAYOUT_TABLE) || LAYOUT_TABLE.LIST
            : LAYOUT_TABLE.LIST,
    toggleLayoutTable: () =>
        set((state) => {
            const newLayout =
                state.layoutTable === LAYOUT_TABLE.LIST
                    ? LAYOUT_TABLE.GRID
                    : LAYOUT_TABLE.LIST;

            if (typeof window !== 'undefined') {
                localStorage.setItem(LOCAL_STORAGE_KEY.LAYOUT_TABLE, newLayout);
            }

            return { layoutTable: newLayout };
        }),
}));
