import { QUERY_KEY } from '@/constants/query-key';

export const releaseDspQueryKey = {
    all: QUERY_KEY.RELEASE_DSP.KEY,
    detail: (id: string) => [
        releaseDspQueryKey.all,
        QUERY_KEY.RELEASE_DSP.GET_DETAIL,
        id,
    ],
};
