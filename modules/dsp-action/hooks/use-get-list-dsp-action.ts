import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { dspActionQueryKeys } from '@/modules/dsp-action/constants/query-keys';
import { useQuery } from '@tanstack/react-query';
import { dspActionApis } from '../apis';
import { DspActionDataFilter } from '../types';

export const useGetListDspAction = (params: DspActionDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: dspActionQueryKeys.lists(),
        queryFn: () => dspActionApis.getListDspAction(params),
        placeholderData: (prev) => prev,
    });

    const dspActionsData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        dspActionsData,
        ...res,
    };
};
