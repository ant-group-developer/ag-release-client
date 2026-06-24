import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { dspReportApi } from '../apis';
import { dspReportQueryKeys } from '../constants/query-keys';
import { DspReportData, DspReportDataFilter } from '../types';

export const useGetListDspReport = (params: DspReportDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: dspReportQueryKeys.list(params),
        queryFn: () => dspReportApi.getList(params),
        placeholderData: (prev) => prev,
    });

    const dspReportData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<DspReportData>['data']);

    return {
        dspReportData,
        ...res,
    };
};
