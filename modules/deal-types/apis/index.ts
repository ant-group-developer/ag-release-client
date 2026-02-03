import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { DealTypeData, DealTypeDataFilter } from '../types';
import {
    CreateDealTypePayload,
    UpdateDealTypePayload,
} from '../types/payloads';

export const dealTypeApis = {
    getList: (params: DealTypeDataFilter) => {
        return axiosInstance.get<PaginationResponse<DealTypeData>>(
            '/distribution/deal-types',
            {
                params,
            }
        );
    },

    getDetail: (id: DealTypeData['id']) => {
        return axiosInstance.get<DetailResponse<DealTypeData>>(
            `/distribution/deal-types/${id}`
        );
    },

    create: (payload: CreateDealTypePayload) => {
        return axiosInstance.post<DetailResponse<DealTypeData>>(
            '/distribution/deal-types',
            payload
        );
    },

    update: (id: DealTypeData['id'], payload: UpdateDealTypePayload) => {
        return axiosInstance.put<DetailResponse<DealTypeData>>(
            `/distribution/deal-types/${id}`,
            payload
        );
    },

    delete: (id: DealTypeData['id']) => {
        return axiosInstance.delete(`/distribution/deal-types/${id}`);
    },
};
