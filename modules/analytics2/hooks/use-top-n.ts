import { useMemo } from 'react';

export function useTopNData<T extends Record<string, any>>(
    data: T[],
    metric: 'views' | 'revenue',
    topN: number
): T[] {
    return useMemo(() => {
        if (!data) return [];
        return [...data]
            .sort((a, b) => {
                const valA = Number(a[metric]) || 0;
                const valB = Number(b[metric]) || 0;
                return valB - valA;
            })
            .slice(0, topN);
    }, [data, metric, topN]);
}
