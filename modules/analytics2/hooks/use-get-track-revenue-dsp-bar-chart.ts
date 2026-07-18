import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueDspBarChartItem, RevenueDspBarChartParams } from '../types';

export const useGetTrackRevenueDspBarChart = (
    isrc: string,
    params: RevenueDspBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trackRevenueDspBarChart(isrc, params),
        queryFn: () => analytics2Apis.getTrackRevenueDspBarChart(isrc, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!isrc,
    });

    return {
        revenueDspBarChartData: data?.data?.data ?? ([] as RevenueDspBarChartItem[]),
        ...res,
    };
};
