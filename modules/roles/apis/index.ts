import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { RolesData, RolesDataDataFilter } from '../types';
import {
    BulkDeleteRoles,
    CreateRolePayload,
    UpdateRolesPayload,
} from '../types/payload';

export const rolesApis = {
    getList: (params: RolesDataDataFilter) => {
        return axiosInstance.get<PaginationResponse<RolesData>>('/roles', {
            params,
        });
    },

    getDetail: (id: RolesData['id']) => {
        return axiosInstance.get<DetailResponse<RolesData>>(`/roles/${id}`);
    },

    createRoles: (payload: CreateRolePayload) => {
        return axiosInstance.post<DetailResponse<RolesData>>('/roles', payload);
    },

    updateRoles: (id: RolesData['id'], payload: UpdateRolesPayload) => {
        return axiosInstance.put<DetailResponse<RolesData>>(
            `/roles/${id}`,
            payload
        );
    },

    deleteRole: (id: RolesData['id']) => {
        return axiosInstance.delete(`/roles/${id}`);
    },

    bulkDeleteRoles: (ids: BulkDeleteRoles['ids']) => {
        return axiosInstance.post(`/roles/bulk-delete`, { ids });
    },

    deleteRolePermission: ({
        roleId,
        rolePermissionId,
    }: {
        roleId: string;
        rolePermissionId: string;
    }) => {
        return axiosInstance.delete(
            `/roles/${roleId}/role-permissions/${rolePermissionId}`
        );
    },
};
