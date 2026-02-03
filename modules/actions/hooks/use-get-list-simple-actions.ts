import { useQuery } from '@tanstack/react-query';
import { actionsApis } from '../apis';
import { actionsQueryKeys } from '../constants/query-keys';

export const useGetListSimpleActions = () => {
    const { data, ...res } = useQuery({
        queryKey: actionsQueryKeys.listsSimple(),
        queryFn: () => actionsApis.getListSimple(),
        placeholderData: (prev) => prev,
    });

    const actionsData = data?.data?.data ?? [];

    return {
        actionsData,
        ...res,
    };
};
