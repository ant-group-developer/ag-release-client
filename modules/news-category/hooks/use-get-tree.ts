import { useQuery } from '@tanstack/react-query';
import { newsCategoryApis } from '../apis';
import { newsCategoryQueryKeys } from '../constants/query-keys';

export const useGetTreeNewsCategory = (options?: { enabled?: boolean }) => {
    const { data, ...res } = useQuery({
        queryKey: newsCategoryQueryKeys.trees(),
        queryFn: () => newsCategoryApis.getTree(),
        enabled: options?.enabled ?? true,
    });

    const newsCategoryTreeData = data?.data?.data ?? [];

    return {
        newsCategoryTreeData,
        ...res,
    };
};
