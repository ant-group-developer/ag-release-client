import axiosAuth from '@/api/axios-auth';
import {
    CommonDataSidebar,
    DetailResponse,
    ListResponse,
    PaginationResponse,
} from '@/types/api';
import {
    CommentRatingData,
    DataFilterComment,
    DataFilterOrder,
    OrderData,
    StatusCountData,
    TypeCountData,
    UseStatusCountData,
} from '../types';
import { CreateOrderPayload } from '../types/create-order';
import {
    UpdateOrderPayload,
    UpdateUsedStatusPayload,
} from '../types/update-order';

export const orderApi = {
    getList: (params: DataFilterOrder) => {
        return axiosAuth.get<PaginationResponse<OrderData>>('/orders', {
            params,
        });
    },

    getDetail: (orderId: OrderData['id']) => {
        return axiosAuth.get<DetailResponse<OrderData>>(`/orders/${orderId}`);
    },

    createOrder: (payload: CreateOrderPayload) => {
        return axiosAuth.post<DetailResponse<OrderData>>(
            '/order-order-product',
            payload
        );
    },

    updateOrder: (payload: UpdateOrderPayload) => {
        return axiosAuth.patch<DetailResponse<OrderData>>(
            `/order-order-product`,
            payload
        );
    },

    updateUsedStatus: (payload: UpdateUsedStatusPayload) => {
        return axiosAuth.patch(
            '/orders/update-status-used-list-order',
            payload
        );
    },

    cancelOrder: (orderId: OrderData['id']) => {
        return axiosAuth.patch<DetailResponse<OrderData>>(
            `/orders/${orderId}/cancel`
        );
    },

    restoreOrder: (orderId: OrderData['id']) => {
        return axiosAuth.patch<DetailResponse<OrderData>>(
            `/orders/${orderId}/restore`
        );
    },

    deleteOrder: (orderId: OrderData['id']) => {
        return axiosAuth.delete(`/orders/${orderId}`);
    },

    createRatingComment: (payload: any) => {
        return axiosAuth.post<DetailResponse<CommentRatingData>>(
            '/review',
            payload
        );
    },

    getRatingComment: (
        orderId: OrderData['id'],
        params?: DataFilterComment
    ) => {
        return axiosAuth.get<ListResponse<CommentRatingData>>(
            `/review/order/${orderId}`,
            { params }
        );
    },

    getStatusCount: (dataFilter: DataFilterOrder) => {
        return axiosAuth.get<ListResponse<StatusCountData>>(
            `/orders/sidebar/status`,
            {
                params: dataFilter,
            }
        );
    },

    getTypeCount: (dataFilter: DataFilterOrder) => {
        return axiosAuth.get<ListResponse<TypeCountData>>(
            'orders/sidebar/type',
            {
                params: dataFilter,
            }
        );
    },

    getCreatorCount: (dataFilter: DataFilterOrder) => {
        return axiosAuth.get<ListResponse<CommonDataSidebar>>(
            'orders/sidebar/creator',
            {
                params: dataFilter,
            }
        );
    },

    getAssigneeCount: (dataFilter: DataFilterOrder) => {
        return axiosAuth.get<ListResponse<CommonDataSidebar>>(
            'orders/sidebar/assignee',
            {
                params: dataFilter,
            }
        );
    },

    getUseStatusCount: (dataFilter: DataFilterOrder) => {
        return axiosAuth.get<ListResponse<UseStatusCountData>>(
            'orders/sidebar/used-status',
            {
                params: dataFilter,
            }
        );
    },
};
