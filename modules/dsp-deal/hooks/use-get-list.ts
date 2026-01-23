import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { dspDealApis } from '../apis';
import { dspDealQueryKeys } from '../constants/query-keys';
import { DspDealData, DspDealDataFilter } from '../types';

export const useGetListDspDeal = (params: DspDealDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: dspDealQueryKeys.list(params),
        queryFn: () => dspDealApis.getList(params.dspId, params),
        placeholderData: (prev) => prev,
    });

    const dspDealData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<DspDealData>['data']);

    return {
        dspDealData,
        ...res,
    };
};
