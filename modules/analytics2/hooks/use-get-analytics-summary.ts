import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams, AnalyticsSummaryData } from '../types';

const DEFAULT_ANALYTICS_SUMMARY_DATA: AnalyticsSummaryData = {
    totalTrendViews: 0,
    totalUsage: 0,
    totalRevenueUsd: 0,
};

export const useGetAnalyticsSummary = (
    params: AnalyticsCommonParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.analyticsSummary(params),
        queryFn: () => analytics2Apis.getAnalyticsSummary(params),
        placeholderData: (prev) => prev,
        enabled,
    });

    return {
        analyticsSummaryData:
            data?.data?.data ?? DEFAULT_ANALYTICS_SUMMARY_DATA,
        ...res,
    };
};
