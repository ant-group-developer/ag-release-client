import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import {
    RevenueDspBarChartV2Item,
    RevenueDspBarChartV2Params,
} from '../types';

export const useGetRevenueDspBarChartV2 = (
    params: RevenueDspBarChartV2Params,
    options: { enabled?: boolean } | boolean = true
) => {
    const queryOptions =
        typeof options === 'boolean' ? { enabled: options } : options;

    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.revenueDspBarChartV2(params),
        queryFn: () => analytics2Apis.getRevenueDspBarChartV2(params),
        placeholderData: (prev) => prev,
        ...queryOptions,
    });

    return {
        revenueDspBarChartData:
            data?.data?.data ?? ([] as RevenueDspBarChartV2Item[]),
        ...res,
    };
};
