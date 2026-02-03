import { QUERY_KEY } from '@/constants/query-key';

export const dspActionQueryKeys = {
    all: [QUERY_KEY.DSP_ACTION.KEY] as const,

    lists: () =>
        [...dspActionQueryKeys.all, QUERY_KEY.DSP_ACTION.GET_LIST] as const,
    list: (params?: Record<string, any>) =>
        params
            ? ([...dspActionQueryKeys.lists(), params] as const)
            : dspActionQueryKeys.lists(),

    details: () =>
        [...dspActionQueryKeys.all, QUERY_KEY.DSP_ACTION.GET_DETAIL] as const,
    detail: (id: string) => [...dspActionQueryKeys.details(), id] as const,
};
