import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams, AnalyticsSummaryData } from '../types';

const DEFAULT_ANALYTICS_SUMMARY_DATA: AnalyticsSummaryData = {
    totalTrendViews: 0,
    totalUsage: 0,
    totalRevenueUsd: 0,
};

export const useGetReleaseSummary = (
    releaseId: string,
    params: AnalyticsCommonParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.releaseSummary(releaseId, params),
        queryFn: () => analytics2Apis.getReleaseSummary(releaseId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!releaseId,
    });

    const releaseSummaryData =
        data?.data?.data ?? DEFAULT_ANALYTICS_SUMMARY_DATA;

    return {
        releaseSummaryData,
        overviewData: releaseSummaryData,
        ...res,
    };
};
