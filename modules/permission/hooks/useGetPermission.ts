import { useQuery } from '@tanstack/react-query';
import { permissionApi } from '../api';
import { permissionQueryKeys } from '../constants';
import { PermissionData } from '../types/data';

export function useGetUserPermission(userId: string, enabled?: boolean) {
    const { data, ...restResponse } = useQuery({
        queryKey: [...permissionQueryKeys.getUserPermission, userId],
        queryFn: () => permissionApi.getUserPermission(userId),
        placeholderData: (previousData) => previousData,
        enabled: Boolean(userId) && (enabled ?? true),
    });

    const defaultData: PermissionData = {
        topic: [],
    };

    return {
        ...restResponse,
        dataUserPermission: data?.data?.data ?? defaultData,
    };
}

export function useGetGroupPermission(groupId: number, enabled?: boolean) {
    const { data, ...restResponse } = useQuery({
        queryKey: [...permissionQueryKeys.getGroupPermission, groupId],
        queryFn: () => permissionApi.getGroupPermission(groupId),
        placeholderData: (previousData) => previousData,
        enabled: Boolean(groupId) && (enabled ?? true),
    });

    const defaultData: PermissionData = {
        topic: [],
    };

    return {
        ...restResponse,
        dataGroupPermission: data?.data?.data ?? defaultData,
    };
}
