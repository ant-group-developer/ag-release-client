import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { PriceTiersData, PriceTiersDataFilter } from '../types';
import {
    CreatePriceTiersPayload,
    UpdatePriceTiersOrderPayload,
    UpdatePriceTiersPayload,
} from '../types/payload';

export const priceTiersApis = {
    getList: (params: PriceTiersDataFilter) => {
        return axiosInstance.get<PaginationResponse<PriceTiersData>>(
            '/price-tiers',
            {
                params,
            }
        );
    },

    getDetail: (id: PriceTiersData['id']) => {
        return axiosInstance.get<DetailResponse<PriceTiersData>>(
            `/price-tiers/${id}`
        );
    },

    createPriceTiers: (payload: CreatePriceTiersPayload) => {
        return axiosInstance.post<DetailResponse<PriceTiersData>>(
            '/price-tiers',
            payload
        );
    },

    updatePriceTiers: (
        id: PriceTiersData['id'],
        payload: UpdatePriceTiersPayload
    ) => {
        return axiosInstance.put<DetailResponse<PriceTiersData>>(
            `/price-tiers/${id}`,
            payload
        );
    },

    deletePriceTiers: (id: PriceTiersData['id']) => {
        return axiosInstance.delete(`/price-tiers/${id}`);
    },

    bulkUpdatePriceTiers: (payload: UpdatePriceTiersOrderPayload) => {
        return axiosInstance.put<DetailResponse<PriceTiersData>>(
            '/price-tiers/bulk',
            payload
        );
    },
};
