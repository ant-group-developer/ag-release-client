import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { actionsApis } from '../apis';
import { actionsQueryKeys } from '../constants/query-keys';
import { ActionsDataFilter } from '../types';

export const useGetListActions = (params: ActionsDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: actionsQueryKeys.list(params),
        queryFn: () => actionsApis.getList(params),
        placeholderData: (prev) => prev,
    });

    const actionsData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        actionsData,
        ...res,
    };
};
