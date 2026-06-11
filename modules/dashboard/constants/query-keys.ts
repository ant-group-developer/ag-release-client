import { QUERY_KEY } from '@/constants/query-key';
import { DashboardDataFilter } from '../types';

export const dashboardQueryKeys = {
    all: [QUERY_KEY.DASHBOARD.KEY],
    getCountIssue: (params: DashboardDataFilter) => [
        ...dashboardQueryKeys.all,
        QUERY_KEY?.DASHBOARD?.GET_COUNT_ISSUE,
        params,
    ],
    getCountOverview: (params: DashboardDataFilter) => [
        ...dashboardQueryKeys.all,
        QUERY_KEY?.DASHBOARD?.GET_COUNT_OVERVIEW,
        params,
    ],
    getCountCountries: (params: DashboardDataFilter) => [
        ...dashboardQueryKeys.all,
        QUERY_KEY?.DASHBOARD?.GET_COUNT_COUNTRY,
        params,
    ],
    getAnalyticDsp: (params: any) => [
        ...dashboardQueryKeys.all,
        'GET_ANALYTIC_DSP',
        params,
    ],
    getAnalyticLabel: (params: any) => [
        ...dashboardQueryKeys.all,
        'GET_ANALYTIC_LABEL',
        params,
    ],
    getAnalyticArtist: (params: any) => [
        ...dashboardQueryKeys.all,
        'GET_ANALYTIC_ARTIST',
        params,
    ],
};

