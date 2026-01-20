import { QUERY_KEY } from '@/constants/query-key';
import { DspDealDataFilter } from '../types';

export const dspDealQueryKeys = {
    all: [QUERY_KEY.DEAL_TYPE.KEY] as const,
    lists: () =>
        [...dspDealQueryKeys.all, QUERY_KEY.DSP_DEAL.GET_LIST] as const,
    list: (params?: DspDealDataFilter) =>
        params
            ? ([...dspDealQueryKeys.lists(), params] as const)
            : dspDealQueryKeys.lists(),
};
