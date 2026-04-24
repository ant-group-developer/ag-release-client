import { ReleaseSubmitFilter } from '../types';

export const releaseSubmitQueryKeys = {
    all: 'RELEASE_SUBMIT',
    getList: () => [releaseSubmitQueryKeys.all, 'GET_LIST_RELEASE_SUBMIT'],
    details: () => [releaseSubmitQueryKeys.all, 'DETAIL'],
    detail: (id: string) => [...releaseSubmitQueryKeys.details(), id],
    getLists: (params: ReleaseSubmitFilter) => [
        ...releaseSubmitQueryKeys.getList(),
        params,
    ],
};
