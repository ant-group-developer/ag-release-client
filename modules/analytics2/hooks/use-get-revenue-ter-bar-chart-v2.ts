import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import {
    RevenueTerBarChartItem,
    RevenueTerBarChartV2Params,
} from '../types';

export const useGetRevenueTerBarChartV2 = (
    params: RevenueTerBarChartV2Params,
    options: { enabled?: boolean } | boolean = true
) => {
    const queryOptions =
        typeof options === 'boolean' ? { enabled: options } : options;

    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.revenueTerBarChartV2(params),
        queryFn: () => analytics2Apis.getRevenueTerBarChartV2(params),
        placeholderData: (prev) => prev,
        ...queryOptions,
    });

    return {
        revenueTerBarChartData:
            data?.data?.data ?? ([] as RevenueTerBarChartItem[]),
        ...res,
    };
};
