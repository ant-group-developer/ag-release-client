import { useQuery } from '@tanstack/react-query';
import { reportConfigApis } from '../apis';
import { enrichHistoryQueryKeys } from '../constants/query-keys';
import { GetEnrichHistoryParams } from '../types/payload';

export const useGetEnrichHistory = (params: GetEnrichHistoryParams) => {
    return useQuery({
        queryKey: enrichHistoryQueryKeys.list(params),
        queryFn: () =>
            reportConfigApis.getEnrichHistory(params).then((res) => res.data.data),
        enabled: !!params.scanId,
    });
};
