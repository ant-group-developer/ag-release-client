import { useEffect, useRef } from 'react';

export interface UseAutoSelectTopRowsOptions<T = any> {
    items?: any[];
    rowKey: (keyof T & string) | string | ((item: any) => string);
    selectedRowKeys?: string[];
    onSelectedRowKeysChange?: (keys: string[]) => void;
    enabled?: boolean;
    count?: number;
    resetDeps?: unknown[];
}

export function useAutoSelectTopRows<T = any>({
    items,
    rowKey,
    selectedRowKeys,
    onSelectedRowKeysChange,
    enabled = true,
    count = 5,
    resetDeps = [],
}: UseAutoSelectTopRowsOptions<T>) {
    const hasAutoSelectedRef = useRef(false);
    const prevEnabledRef = useRef(enabled);
    const prevResetDepsRef = useRef(resetDeps);

    // Reset flag when modal / component becomes enabled again
    useEffect(() => {
        if (!prevEnabledRef.current && enabled) {
            hasAutoSelectedRef.current = false;
        }
        prevEnabledRef.current = enabled;
    }, [enabled]);

    // Reset flag only when elements in resetDeps actually change by value
    useEffect(() => {
        const isChanged =
            resetDeps.length !== prevResetDepsRef.current.length ||
            resetDeps.some(
                (dep, i) => !Object.is(dep, prevResetDepsRef.current[i])
            );

        if (isChanged) {
            hasAutoSelectedRef.current = false;
            prevResetDepsRef.current = resetDeps;
        }
    });

    useEffect(() => {
        if (!enabled || hasAutoSelectedRef.current || !onSelectedRowKeysChange) {
            return;
        }

        if (items && items.length > 0) {
            hasAutoSelectedRef.current = true;
            if (selectedRowKeys && selectedRowKeys.length > 0) {
                return;
            }
            const topKeys = items
                .map((item) => {
                    if (typeof rowKey === 'function') {
                        return rowKey(item);
                    }
                    const val = (item as Record<string, any>)?.[rowKey];
                    return val != null ? String(val) : '';
                })
                .filter(Boolean)
                .slice(0, count);

            if (topKeys.length > 0) {
                onSelectedRowKeysChange(topKeys);
            }
        }
    }, [items, enabled, count, rowKey, selectedRowKeys, onSelectedRowKeysChange]);
}
