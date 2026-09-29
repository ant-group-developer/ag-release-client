import { useQuery } from '@tanstack/react-query';
import { releaseMergeApis } from '../apis';
import { releaseMergeQueryKeys } from '../constants/query-keys';
import { RUNNING_RELEASE_MERGE_STATUSES } from '../enums';

export const useGetReleaseMergeScan = (
    scanId?: string | null,
    enabled = true
) => {
    const { data, ...res } = useQuery({
        queryKey: releaseMergeQueryKeys.detail(scanId ?? ''),
        queryFn: () => releaseMergeApis.getScan(scanId as string),
        enabled: enabled && !!scanId,
        refetchInterval: (query) => {
            const status = query.state.data?.data?.data?.status;
            return RUNNING_RELEASE_MERGE_STATUSES.includes(status as never)
                ? 2000
                : false;
        },
    });

    return {
        scan: data?.data?.data ?? null,
        ...res,
    };
};
