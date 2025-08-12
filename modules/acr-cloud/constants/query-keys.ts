import { QUERY_KEY } from '@/constants/query-key';

export const acrCloudQueryKeys = {
    all: [QUERY_KEY.ACR_CLOUD.KEY],
    getLists: () =>
        [...acrCloudQueryKeys.all, QUERY_KEY.ACR_CLOUD.GET_LIST] as const,
    getDetails: () =>
        [...acrCloudQueryKeys.all, QUERY_KEY.ACR_CLOUD.GET_DETAIL] as const,
    getDetail: (id: string) => [...acrCloudQueryKeys.getDetails(), id] as const,
};
