import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { dealTypeApis } from '../apis';
import { dealTypeQueryKeys } from '../constants/query-keys';
import { DealTypeData, DealTypeDataFilter } from '../types';

export const useGetListDealType = (params: DealTypeDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: dealTypeQueryKeys.list(params),
        queryFn: () => dealTypeApis.getList(params),
        placeholderData: (prev) => prev,
    });

    const dealTypeData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<DealTypeData>['data']);

    return {
        dealTypeData,
        ...res,
    };
};
