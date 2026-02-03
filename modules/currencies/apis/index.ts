import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import {
    CurrenciesData,
    CurrenciesDataFilter,
    CurrenciesSimpleData,
} from '../types';
import {
    CreateCurrenciesPayload,
    UpdateCurrenciesPayload,
} from '../types/payload';

export const currenciesApis = {
    getList: (params: CurrenciesDataFilter) => {
        return axiosInstance.get<PaginationResponse<CurrenciesData>>(
            '/currencies',
            {
                params,
            }
        );
    },

    getListSimple: () => {
        return axiosInstance.get<DetailResponse<CurrenciesSimpleData[]>>(
            '/currencies/simple'
        );
    },

    getDetail: (id: CurrenciesData['id']) => {
        return axiosInstance.get<DetailResponse<CurrenciesData>>(
            `/currencies/${id}`
        );
    },

    createCurrency: (payload: CreateCurrenciesPayload) => {
        return axiosInstance.post<DetailResponse<CurrenciesData>>(
            '/currencies',
            payload
        );
    },

    updateCurrency: (
        id: CurrenciesData['id'],
        payload: UpdateCurrenciesPayload
    ) => {
        return axiosInstance.put<DetailResponse<CurrenciesData>>(
            `/currencies/${id}`,
            payload
        );
    },

    deleteCurrency: (id: CurrenciesData['id']) => {
        return axiosInstance.delete(`/currencies/${id}`);
    },
};
