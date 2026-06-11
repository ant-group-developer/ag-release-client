import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { reportConfigApis } from '../apis';
import { reportConfigQueryKeys } from '../constants/query-keys';
import { ReportConfigData, ReportConfigDataFilter } from '../types';

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
