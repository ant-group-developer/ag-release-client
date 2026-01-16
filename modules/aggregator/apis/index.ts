import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { AggregatorData, AggregatorDataFilter } from '../types';
import {
    CreateAggregatorPayload,
    UpdateAggregatorPayload,
} from '../types/payloads';

export const aggregatorApis = {
    getList: (params: AggregatorDataFilter) => {
        return axiosInstance.get<PaginationResponse<AggregatorData>>(
            '/distribution-channel/aggregators',
            { params }
        );
    },
    getDetail: (id: string) => {
        return axiosInstance.get<DetailResponse<AggregatorData>>(
            `/distribution-channel/aggregators/${id}`
        );
    },
    create: (payload: CreateAggregatorPayload) => {
        return axiosInstance.post<DetailResponse<AggregatorData>>(
            `/distribution-channel/aggregators`,
            payload
        );
    },
    update: (id: string, payload: UpdateAggregatorPayload) => {
        return axiosInstance.put<DetailResponse<AggregatorData>>(
            `/distribution-channel/aggregators/${id}`,
            payload
        );
    },
    delete: (id: string) => {
        return axiosInstance.delete(`/distribution-channel/aggregators/${id}`);
    },
};
