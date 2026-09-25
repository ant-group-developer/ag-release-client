import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import {
    TrendViewDemographicsBarChartData,
    TrendViewDemographicsBarChartV2Params,
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

export const useGetTrendViewDeviceBarChartV2 = (
    params: TrendViewDemographicsBarChartV2Params,
    options: { enabled?: boolean } | boolean = true
) => {
    const queryOptions =
        typeof options === 'boolean' ? { enabled: options } : options;

    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trendViewDeviceBarChartV2(params),
        queryFn: () => analytics2Apis.getTrendViewDeviceBarChartV2(params),
        placeholderData: (prev) => prev,
        ...queryOptions,
    });

    return {
        barChartData: getDemographicsData(data),
        ...res,
    };
};

export const useGetTrendViewGenderBarChartV2 = (
    params: TrendViewDemographicsBarChartV2Params,
    options: { enabled?: boolean } | boolean = true
) => {
    const queryOptions =
        typeof options === 'boolean' ? { enabled: options } : options;

    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trendViewGenderBarChartV2(params),
        queryFn: () => analytics2Apis.getTrendViewGenderBarChartV2(params),
        placeholderData: (prev) => prev,
        ...queryOptions,
    });

    return {
        barChartData: getDemographicsData(data),
        ...res,
    };
};

export const useGetTrendViewAgeRangeBarChartV2 = (
    params: TrendViewDemographicsBarChartV2Params,
    options: { enabled?: boolean } | boolean = true
) => {
    const queryOptions =
        typeof options === 'boolean' ? { enabled: options } : options;

    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trendViewAgeRangeBarChartV2(params),
        queryFn: () => analytics2Apis.getTrendViewAgeRangeBarChartV2(params),
        placeholderData: (prev) => prev,
        ...queryOptions,
    });

    return {
        barChartData: getDemographicsData(data),
        ...res,
    };
};

export const useGetTrendViewDemographicsBarChartsV2 = (
    params: TrendViewDemographicsBarChartV2Params,
    options: { enabled?: boolean } | boolean = true
) => {
    const deviceQuery = useGetTrendViewDeviceBarChartV2(params, options);
    const genderQuery = useGetTrendViewGenderBarChartV2(params, options);
    const ageQuery = useGetTrendViewAgeRangeBarChartV2(params, options);

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
