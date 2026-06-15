import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueDspBarChartItem, RevenueDspBarChartParams } from '../types';

export const useGetRevenueDspBarChart = (
    params: RevenueDspBarChartParams,
    options?: { enabled?: boolean }
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.revenueDspBarChart(params),
        queryFn: () => analytics2Apis.getRevenueDspBarChart(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    return {
        revenueDspBarChartData: data?.data?.data ?? ([] as RevenueDspBarChartItem[]),
        ...res,
    };
};
