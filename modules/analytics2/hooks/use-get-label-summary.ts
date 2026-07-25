import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams, AnalyticsSummaryData } from '../types';

const DEFAULT_ANALYTICS_SUMMARY_DATA: AnalyticsSummaryData = {
    totalTrendViews: 0,
    totalUsage: 0,
    totalRevenueUsd: 0,
};

export const useGetLabelSummary = (
    labelId: string,
    params: AnalyticsCommonParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.labelSummary(labelId, params),
        queryFn: () => analytics2Apis.getLabelSummary(labelId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!labelId,
    });

    return {
        labelSummaryData:
            data?.data?.data ?? DEFAULT_ANALYTICS_SUMMARY_DATA,
        ...res,
    };
};
