import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsSummaryData, AnalyticsSummaryV2Params } from '../types';

const DEFAULT_ANALYTICS_SUMMARY_DATA: AnalyticsSummaryData = {
    totalTrendViews: 0,
    totalUsage: 0,
    totalRevenueUsd: 0,
};

export const useGetAnalyticsSummaryV2 = (
    params: AnalyticsSummaryV2Params,
    options: { enabled?: boolean } | boolean = true
) => {
    const queryOptions =
        typeof options === 'boolean' ? { enabled: options } : options;

    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.analyticsSummaryV2(params),
        queryFn: () => analytics2Apis.getAnalyticsSummaryV2(params),
        placeholderData: (prev) => prev,
        ...queryOptions,
    });

    return {
        analyticsSummaryData:
            data?.data?.data ?? DEFAULT_ANALYTICS_SUMMARY_DATA,
        ...res,
    };
};
