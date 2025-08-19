import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { rolesApis } from '../apis';
import { rolesQueryKeys } from '../constants/query-keys';
import { RolesDataDataFilter } from '../types';

export const useGetListRoles = (params: RolesDataDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: rolesQueryKeys.list(params),
        queryFn: () => rolesApis.getList(params),
        placeholderData: (prev) => prev,
    });

    const rolesData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        rolesData,
        ...res,
    };
};
