import { QUERY_KEY } from '@/constants/query-key';
import { IntegrationData, IntegrationDataFilter } from '../types';

export const integrationQueryKeys = {
    all: [QUERY_KEY.INTEGRATION.KEY],
    lists: () => [...integrationQueryKeys.all, QUERY_KEY.INTEGRATION.GET_LIST],
    list: (params: IntegrationDataFilter) =>
        params
            ? [...integrationQueryKeys.lists(), params]
            : integrationQueryKeys.lists(),
    detail: (id: IntegrationData['id']) => [
        ...integrationQueryKeys.all,
        QUERY_KEY.INTEGRATION.GET_DETAIL,
        id,
    ],
};
