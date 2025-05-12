import axiosAuth from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import { PermissionData } from '../types/data';
import { UpdatePermissionPayload } from '../types/update';

export const permissionApi = {
    getUserPermission(userId: string) {
        return axiosAuth.get<DetailResponse<PermissionData>>(
            `permission/user/${userId}`
        );
    },

    getGroupPermission(groupId: number) {
        return axiosAuth.get<DetailResponse<PermissionData>>(
            `permission/group/${groupId}`
        );
    },

    updateUserPermission(userId: string, payload: UpdatePermissionPayload) {
        return axiosAuth.put(`permission/user/${userId}`, payload);
    },

    updateGroupPermission(groupId: number, payload: UpdatePermissionPayload) {
        return axiosAuth.put(`permission/group/${groupId}`, payload);
    },
};
