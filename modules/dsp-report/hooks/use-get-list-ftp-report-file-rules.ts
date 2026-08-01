import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { dspReportApi } from '../apis';
import { dspReportQueryKeys } from '../constants/query-keys';
import { FtpReportFileRule, FtpReportFileRuleFilter } from '../types';

export const useGetListFtpReportFileRules = (
    params?: FtpReportFileRuleFilter
) => {
    const { data, ...res } = useQuery({
        queryKey: dspReportQueryKeys.ftpReportFileRules(params),
        queryFn: () => dspReportApi.getFtpReportFileRules(params),
        placeholderData: (prev) => prev,
    });

    const ftpReportFileRulesData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<FtpReportFileRule>['data']);

    return {
        ftpReportFileRulesData,
        ...res,
    };
};
