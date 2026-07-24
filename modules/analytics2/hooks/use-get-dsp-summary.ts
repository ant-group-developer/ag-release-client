import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsSummaryData, DspDetailParams } from '../types';

const DEFAULT_ANALYTICS_SUMMARY_DATA: AnalyticsSummaryData = {
    totalTrendViews: 0,
    totalUsage: 0,
    totalRevenueUsd: 0,
};

export const useGetDspSummary = (
    params: DspDetailParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.dspSummary(params),
        queryFn: () => analytics2Apis.getDspSummary({ ...params }),
        placeholderData: (prev) => prev,
        enabled: enabled && !!params.pgDspId && !!params.dspReportId,
    });

    return {
        dspSummaryData:
            data?.data?.data ?? DEFAULT_ANALYTICS_SUMMARY_DATA,
        ...res,
    };
};
