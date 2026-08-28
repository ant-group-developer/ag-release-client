import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import {
    AnalyticsCommonParams,
    TrendViewDemographicsBarChartData,
} from '../types';

const EMPTY_DEMOGRAPHICS: TrendViewDemographicsBarChartData = {
    totalViews: 0,
    coverage: null,
    items: [],
};

const getDemographicsData = (
    data: { data?: { data?: TrendViewDemographicsBarChartData } } | undefined
): TrendViewDemographicsBarChartData => {
    const payload = data?.data?.data;
    return {
        totalViews: payload?.totalViews ?? 0,
        coverage: payload?.coverage ?? null,
        items: payload?.items ?? EMPTY_DEMOGRAPHICS.items,
    };
};

export const useGetTrendViewDeviceBarChart = (
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trendViewDeviceBarChart(params),
        queryFn: () => analytics2Apis.getTrendViewDeviceBarChart(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    return {
        barChartData: getDemographicsData(data),
        ...res,
    };
};

export const useGetTrendViewGenderBarChart = (
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trendViewGenderBarChart(params),
        queryFn: () => analytics2Apis.getTrendViewGenderBarChart(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    return {
        barChartData: getDemographicsData(data),
        ...res,
    };
};

export const useGetTrendViewAgeRangeBarChart = (
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trendViewAgeRangeBarChart(params),
        queryFn: () => analytics2Apis.getTrendViewAgeRangeBarChart(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    return {
        barChartData: getDemographicsData(data),
        ...res,
    };
};

export const useGetTrendViewDemographicsBarCharts = (
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const deviceQuery = useGetTrendViewDeviceBarChart(params, options);
    const genderQuery = useGetTrendViewGenderBarChart(params, options);
    const ageQuery = useGetTrendViewAgeRangeBarChart(params, options);

    return {
        device: deviceQuery.barChartData,
        gender: genderQuery.barChartData,
        age: ageQuery.barChartData,
        isFetching:
            deviceQuery.isFetching ||
            genderQuery.isFetching ||
            ageQuery.isFetching,
    };
};
