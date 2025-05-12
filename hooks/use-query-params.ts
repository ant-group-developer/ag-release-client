'use client';

import { useSearchParams } from 'next/navigation';

function useQueryParams() {
    const queryParams: any = {};
    const searchParams = useSearchParams();
    searchParams?.forEach((value, key) => {
        queryParams[key] = value;
    });
    return queryParams;
}

export { useQueryParams };
