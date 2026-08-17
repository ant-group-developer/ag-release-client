import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import {
    enrichScanScheduleApis,
    ftpExcludePatternApis,
    ftpProviderConfigApis,
    reportConfigApis,
} from '../apis';
import {
    enrichScanScheduleQueryKeys,
    ftpExcludePatternQueryKeys,
    ftpProviderConfigQueryKeys,
    reportConfigQueryKeys,
} from '../constants/query-keys';
import {
    FtpExcludePatternData,
    FtpExcludePatternDataFilter,
    FtpProviderConfigData,
    FtpProviderConfigDataFilter,
    ReportConfigData,
    ReportConfigDataFilter,
} from '../types';

export const useGetListReportConfig = (params: ReportConfigDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: reportConfigQueryKeys.list(params),
        queryFn: () => reportConfigApis.getList(params),
        placeholderData: (prev) => prev,
    });

    const reportConfigsData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<ReportConfigData>['data']);

    return {
        reportConfigsData,
        ...res,
    };
};

export const useGetListFtpExcludePattern = (
    params: FtpExcludePatternDataFilter
) => {
    const { data, ...res } = useQuery({
        queryKey: ftpExcludePatternQueryKeys.list(params),
        queryFn: () => ftpExcludePatternApis.getList(params),
        placeholderData: (prev) => prev,
    });

    const ftpExcludePatternsData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<FtpExcludePatternData>['data']);

    return {
        ftpExcludePatternsData,
        ...res,
    };
};

export const useGetListEnrichScanSchedule = () => {
    const { data, ...res } = useQuery({
        queryKey: enrichScanScheduleQueryKeys.list(),
        queryFn: () => enrichScanScheduleApis.getList({}),
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: true,
    });

    const enrichScanSchedulesData = data?.data?.data?.items || [];

    return {
        enrichScanSchedulesData,
        ...res,
    };
};

export const useGetListFtpProviderConfig = (
    params: FtpProviderConfigDataFilter
) => {
    const { data, ...res } = useQuery({
        queryKey: ftpProviderConfigQueryKeys.list(params),
        queryFn: () => ftpProviderConfigApis.getList(params),
        placeholderData: (prev) => prev,
    });

    const ftpProviderConfigsData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<FtpProviderConfigData>['data']);

    return {
        ftpProviderConfigsData,
        ...res,
    };
};
