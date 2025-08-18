import { useQuery } from '@tanstack/react-query';
import { actionsApis } from '../apis';
import { actionsQueryKeys } from '../constants/query-keys';
import { ActionsData } from '../types';

export const useGetDetailAction = (id: ActionsData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: actionsQueryKeys.detail(id),
        queryFn: () => actionsApis.getDetail(id),
    });

    const defaultData: ActionsData = {
        name: '',
        code: '',
        note: '',
        id: '',
        createdAt: '',
        updatedAt: null,
    };

    return {
        actionData: data?.data?.data ?? defaultData,
        ...res,
    };
};
