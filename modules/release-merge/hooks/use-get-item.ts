import { useQuery } from '@tanstack/react-query';
import { releaseMergeApis } from '../apis';
import { releaseMergeQueryKeys } from '../constants/query-keys';

export const useGetReleaseMergeItem = (
    scanId?: string | null,
    itemId?: string | null,
    enabled = true
) => {
    const { data, ...res } = useQuery({
        queryKey: releaseMergeQueryKeys.item(scanId ?? '', itemId ?? ''),
        queryFn: () =>
            releaseMergeApis.getItem(scanId as string, itemId as string),
        enabled: enabled && !!scanId && !!itemId,
    });

    return {
        item: data?.data?.data ?? null,
        ...res,
    };
};
