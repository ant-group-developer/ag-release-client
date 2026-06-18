'use client';

import { useSearchParams } from 'next/navigation';

function useQueryParams() {
    const queryParams: any = {};
    const searchParams = useSearchParams();
    searchParams?.forEach((value, key) => {
        if (value.startsWith('{') || value.startsWith('[')) {
            try {
                queryParams[key] = JSON.parse(value);
                return;
            } catch {}
        }
        queryParams[key] = value;
    });
    return queryParams;
}

export { useQueryParams };
