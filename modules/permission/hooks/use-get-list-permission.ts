import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { permissionApis } from '../apis';
import { permissionQueryKeys } from '../constants/query-keys';
import { PermissionDataDataFilter } from '../types';

export const useGetListPermission = (params: PermissionDataDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: permissionQueryKeys.list(params),
        queryFn: () => permissionApis.getList({ isActive: true, ...params }),
        placeholderData: (prev) => prev,
    });

    const permissionData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        permissionData,
        ...res,
    };
};
