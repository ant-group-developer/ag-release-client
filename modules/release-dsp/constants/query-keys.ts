import { QUERY_KEY } from '@/constants/query-key';
import { ReleaseDspDataFilter } from '../types';

export const releaseDspQueryKey = {
    all: QUERY_KEY.RELEASE_DSP.KEY,
    detail: (id: string, params?: ReleaseDspDataFilter) => [
        releaseDspQueryKey.all,
        QUERY_KEY.RELEASE_DSP.GET_DETAIL,
        params,
        id,
    ],
};
