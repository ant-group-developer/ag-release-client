import { QUERY_KEY } from '@/constants/query-key';

export const dspQueryKeys = {
    all: [QUERY_KEY.DSP.KEY] as const,

    lists: () => [...dspQueryKeys.all, QUERY_KEY.DSP.GET_LIST] as const,
    list: (params?: Record<string, any>) =>
        params
            ? ([...dspQueryKeys.lists(), params] as const)
            : dspQueryKeys.lists(),

    details: () => [...dspQueryKeys.all, QUERY_KEY.DSP.GET_DETAIL] as const,
    detail: (id: string) => [...dspQueryKeys.details(), id] as const,
};
