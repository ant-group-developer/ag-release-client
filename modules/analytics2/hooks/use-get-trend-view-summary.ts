import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewSummaryData, TrendViewSummaryParams } from '../types';

const DEFAULT_TREND_VIEW_SUMMARY_DATA: TrendViewSummaryData = {
    totalViews: 0,
};

export const useGetTrendViewSummary = (params: TrendViewSummaryParams) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trendViewSummary(params),
        queryFn: () => analytics2Apis.getTrendViewSummary(params),
        placeholderData: (prev) => prev,
    });

    return {
        trendViewSummaryData:
            data?.data?.data ?? DEFAULT_TREND_VIEW_SUMMARY_DATA,
        ...res,
    };
};
