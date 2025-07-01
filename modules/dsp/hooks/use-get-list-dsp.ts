import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { dspApi } from '../apis';
import { dspQueryKeys } from '../constants/query-keys';
import { DspDataFilter } from '../types';

export const useGetListDsp = (params: DspDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: [...dspQueryKeys.getList, params],
        queryFn: () => dspApi.getList(params),
    });

    const dspData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        dspData,
        ...res,
    };
};
