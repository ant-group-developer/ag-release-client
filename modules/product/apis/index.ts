import axiosAuth from '@/api/axios-auth';
import { OrderProduct } from '@/modules/order/types';
import { TopicCountData } from '@/modules/topic/types';
import {
    CommonDataSidebar,
    ListResponse,
    PaginationResponse,
} from '@/types/api';
import {
    AssignUserPayload,
    CountStatusData,
    CountTypeData,
    DataFilterProduct,
    ProductData,
    ProductUploadHistoryData,
    RemoveAssigneePayload,
    UploadProductHistoryPayload,
} from '../types';
import { SubmitProductFile } from '../types/update-product-file';

export const productApi = {
    getAll: (params: DataFilterProduct) => {
        return axiosAuth.get<PaginationResponse<ProductData>>(
            '/order-product',
            { params }
        );
    },

    update: (orderProductId: string, payload: { rate: number }) => {
        return axiosAuth.patch(`order-product/${orderProductId}`, payload);
    },

    assignUser: (payload: AssignUserPayload) => {
        return axiosAuth.post<ListResponse>('order-product/assign', payload);
    },

    removeAssignee: (params: RemoveAssigneePayload) => {
        return axiosAuth.patch<ListResponse>(
            `order-product/remove-assignee`,
            params
        );
    },

    getCountType: (dataFilter: DataFilterProduct) => {
        return axiosAuth.get<ListResponse<CountTypeData>>(
            'order-product/sidebar/type',
            { params: dataFilter }
        );
    },

    getCountStatus: (dataFilter: DataFilterProduct) => {
        return axiosAuth.get<ListResponse<CountStatusData>>(
            'order-product/sidebar/status',
            { params: dataFilter }
        );
    },

    getCountTopic: (dataFilter: DataFilterProduct) => {
        return axiosAuth.get<ListResponse<TopicCountData>>(
            'order-product/sidebar/topic',
            { params: dataFilter }
        );
    },

    getCountAssignee: (dataFilter: DataFilterProduct) => {
        return axiosAuth.get<ListResponse<CommonDataSidebar>>(
            'order-product/sidebar/assignee',
            { params: dataFilter }
        );
    },

    getCountCreator: (dataFilter: DataFilterProduct) => {
        return axiosAuth.get<ListResponse<CommonDataSidebar>>(
            'order-product/sidebar/creator',
            { params: dataFilter }
        );
    },

    getAssigneeUserList: () => {
        return axiosAuth.get<ListResponse<CommonDataSidebar>>(
            'order-product/sidebar/list-user-assignee'
        );
    },

    getApprovalUserList: () => {
        return axiosAuth.get<ListResponse<CommonDataSidebar>>(
            'order-product/sidebar/list-user-approver'
        );
    },

    getUploadHistory: (params: UploadProductHistoryPayload) => {
        return axiosAuth.get<ListResponse<ProductUploadHistoryData>>(
            `order-product/history`,
            {
                params,
            }
        );
    },

    submitProductFile(
        orderProductId: OrderProduct['id'],
        payload: SubmitProductFile
    ) {
        return axiosAuth.post(
            `order-product/${orderProductId}/submit-file`,
            payload
        );
    },
};
