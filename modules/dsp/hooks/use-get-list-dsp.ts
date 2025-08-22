import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { dspApi } from '../apis';
import { dspQueryKeys } from '../constants/query-keys';
import { DspData, DspDataFilter } from '../types';

export const useGetListDsp = (params: DspDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: dspQueryKeys.list(params),
        queryFn: () => dspApi.getList(params),
        placeholderData: (prev) => prev,
    });

    const dspData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<DspData>['data']);

    const lastUpdatedAt = formattedDate(
        res.dataUpdatedAt,
        DATE_FORMAT.HOUR_MINUTE_SECOND
    );

    return {
        dspData,
        lastUpdatedAt,
        ...res,
    };
};
