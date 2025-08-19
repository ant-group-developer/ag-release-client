import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api';
import { userQueryKeys } from '../constants';
import {
    DataFilterUser,
    UserData,
    UserDetail,
    UserPermissionData,
    UserRoleData,
} from '../types/data';

export function useUserList(params: DataFilterUser) {
    const { data, ...restResponse } = useQuery({
        queryKey: userQueryKeys.list(params),
        queryFn: () => userApi.getList(params),
        placeholderData: (previousData) => previousData,
    });

    return {
        ...restResponse,
        data:
            data?.data?.data ??
            (DEFAULT_DATA_PAGINATION as PaginationResponse<UserData>['data']),
    };
}

export function useUserDetail(id: string | null) {
    const { data, ...restResponse } = useQuery({
        queryKey: userQueryKeys.detail(id ?? ''),
        queryFn: () => userApi.getDetail(id as string),
        enabled: Boolean(id),
    });

    return {
        ...restResponse,
        dataUser: data?.data?.data ?? ({} as UserDetail),
    };
}

export function useUserRole(id: string | null) {
    const { data, ...restResponse } = useQuery({
        queryKey: userQueryKeys.role(id ?? ''),
        queryFn: () => userApi.getUserRole(id as string),
        enabled: Boolean(id),
    });

    return {
        ...restResponse,
        data: data?.data?.data ?? ([] as UserRoleData[]),
    };
}

export function useUserPermission(id: string | null) {
    const { data, ...restResponse } = useQuery({
        queryKey: userQueryKeys.role(id ?? ''),
        queryFn: () => userApi.getUserPermission(id as string),
        enabled: Boolean(id),
    });

    return {
        ...restResponse,
        data: data?.data?.data ?? ([] as UserPermissionData[]),
    };
}
