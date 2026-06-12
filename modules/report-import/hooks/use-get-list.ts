import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { reportConfigApis, ftpExcludePatternApis } from '../apis';
import { reportConfigQueryKeys, ftpExcludePatternQueryKeys } from '../constants/query-keys';
import { ReportConfigData, ReportConfigDataFilter, FtpExcludePatternData, FtpExcludePatternDataFilter } from '../types';

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

export const useGetListFtpExcludePattern = (params: FtpExcludePatternDataFilter) => {
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
