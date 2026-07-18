import { useQuery } from '@tanstack/react-query';
import { dashboardApis } from '../apis';
import { dashboardQueryKeys } from '../constants/query-keys';
import { AnalyticDashboardParams, AnalyticDashboardData } from '../types';

export const useGetAnalyticDsp = (params: AnalyticDashboardParams, options?: { enabled?: boolean }) => {
    const { data, ...res } = useQuery({
        queryKey: dashboardQueryKeys.getAnalyticDsp(params),
        queryFn: () => dashboardApis.getAnalyticDsp(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    return {
        analyticDspData: data?.data?.data ?? ([] as AnalyticDashboardData[]),
        ...res,
    };
};

export const useGetAnalyticLabel = (params: AnalyticDashboardParams, options?: { enabled?: boolean }) => {
    const { data, ...res } = useQuery({
        queryKey: dashboardQueryKeys.getAnalyticLabel(params),
        queryFn: () => dashboardApis.getAnalyticLabel(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    return {
        analyticLabelData: data?.data?.data ?? ([] as AnalyticDashboardData[]),
        ...res,
    };
};

export const useGetAnalyticArtist = (params: AnalyticDashboardParams, options?: { enabled?: boolean }) => {
    const { data, ...res } = useQuery({
        queryKey: dashboardQueryKeys.getAnalyticArtist(params),
        queryFn: () => dashboardApis.getAnalyticArtist(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    return {
        analyticArtistData: data?.data?.data ?? ([] as AnalyticDashboardData[]),
        ...res,
    };
};
