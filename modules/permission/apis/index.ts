import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import {
    PermissionData,
    PermissionDataDataFilter,
    PermissionSimpleData,
} from '../types';
import {
    BulkCreatePermissionPayload,
    BulkDeletePermission,
    CreatePermissionPayload,
    UpdatePermissionPayload,
} from '../types/payload';

export const permissionApis = {
    getList: (params: PermissionDataDataFilter) => {
        return axiosInstance.get<PaginationResponse<PermissionData>>(
            '/permission',
            {
                params,
            }
        );
    },

    getListSimple: () => {
        return axiosInstance.get<DetailResponse<PermissionSimpleData[]>>(
            '/permission/simple'
        );
    },

    getDetail: (id: PermissionData['id']) => {
        return axiosInstance.get<DetailResponse<PermissionData>>(
            `/permission/${id}`
        );
    },

    createPermission: (payload: CreatePermissionPayload) => {
        return axiosInstance.post<DetailResponse<PermissionData>>(
            '/permission',
            payload
        );
    },

    bulkCreatePermission: (payload: BulkCreatePermissionPayload) => {
        return axiosInstance.post('/permission/bulk', payload);
    },

    updatePermission: (
        id: PermissionData['id'],
        payload: UpdatePermissionPayload
    ) => {
        return axiosInstance.put<DetailResponse<PermissionData>>(
            `/permission/${id}`,
            payload
        );
    },

    deletePermission: (id: PermissionData['id']) => {
        return axiosInstance.delete(`/permission/${id}`);
    },

    bulkDeletePermission: (ids: BulkDeletePermission['ids']) => {
        return axiosInstance.post(`/permission/bulk-delete`, { ids });
    },
};
