import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import {
    CountryCountData,
    DashboardDataFilter,
    IssueCountData,
    OverviewCountData,
} from '../types';

export const dashboardApis = {
    getCountIssues: (params: DashboardDataFilter) => {
        return axiosInstance.get<DetailResponse<IssueCountData[]>>(
            '/statistics/issues/count',
            { params }
        );
    },
    getCountOverview: (params: DashboardDataFilter) => {
        return axiosInstance.get<DetailResponse<OverviewCountData>>(
            '/statistics/overview/count',
            { params }
        );
    },
    getCountCountries: (params: DashboardDataFilter) => {
        return axiosInstance.get<DetailResponse<CountryCountData[]>>(
            '/statistics/stream/count/by-country',
            { params }
        );
    },
};
