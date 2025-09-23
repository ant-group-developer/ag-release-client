import { useQuery } from '@tanstack/react-query';
import { dashboardApis } from '../apis';
import { dashboardQueryKeys } from '../constants/query-keys';
import {
    CountryCountData,
    DashboardDataFilter,
    IssueCountData,
    OverviewCountData,
} from '../types';

export const useGetCountIssues = (params: DashboardDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: dashboardQueryKeys.getCountIssue(params),
        queryFn: () => dashboardApis.getCountIssues(params),
        placeholderData: (prev) => prev,
    });

    return {
        countIssuesData: data?.data?.data ?? ([] as IssueCountData[]),
        ...res,
    };
};

export const useGetCountOverview = (params: DashboardDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: dashboardQueryKeys.getCountOverview(params),
        queryFn: () => dashboardApis.getCountOverview(params),
        placeholderData: (prev) => prev,
    });

    return {
        countOverviewData: data?.data?.data ?? ({} as OverviewCountData),
        ...res,
    };
};

export const useGetCountCountries = (params: DashboardDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: dashboardQueryKeys.getCountCountries(params),
        queryFn: () => dashboardApis.getCountCountries(params),
        placeholderData: (prev) => prev,
    });
    return {
        countCountriesData: data?.data?.data ?? ([] as CountryCountData[]),
        ...res,
    };
};
