import axiosAuth from '@/api/axios-auth';
import { DataFilterOrder } from '@/modules/order/types';
import { ListResponse, PaginationResponse } from '@/types/api';
import { PriorityPayload } from '../hooks/use-create-priority';
import { UpdatePriorityOrderPayload } from '../hooks/use-update-priority-order';
import { PriorityCountData, PriorityData } from '../types';

export const prioritiesApi = {
    getList: () => {
        return axiosAuth.get<PaginationResponse<PriorityData>>('/priorities');
    },
    getCountPriorities: (params?: DataFilterOrder) => {
        return axiosAuth.get<ListResponse<PriorityCountData>>(
            '/orders/sidebar/priority',
            { params }
        );
    },
    createPriority: (payload: PriorityPayload) => {
        return axiosAuth.post<PriorityData>('/priorities', payload);
    },
    deletePriority: (priorityId: PriorityData['id']) => {
        return axiosAuth.delete(`/priorities/${priorityId}`);
    },
    updatePriority: (
        priorityId: PriorityData['id'],
        payload: PriorityPayload
    ) => {
        return axiosAuth.patch(`/priorities/${priorityId}`, payload);
    },
    updatePriorityOrder: (payload: UpdatePriorityOrderPayload) => {
        return axiosAuth.patch('/priorities/update-order', payload);
    },
};
