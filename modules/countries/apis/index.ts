import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import {
    CountriesData,
    CountriesDataFilter,
    CountriesSimpleData,
} from '../types';
import { CreateCountryPayload, UpdateCountryPayload } from '../types/payload';

export const countriesApi = {
    getList: (params: CountriesDataFilter) => {
        return axiosInstance.get<PaginationResponse<CountriesData>>(
            '/countries',
            {
                params,
            }
        );
    },
    getListSimple: () => {
        return axiosInstance.get<DetailResponse<CountriesSimpleData[]>>(
            '/countries/simple'
        );
    },
    getDetail: (id: CountriesData['id']) => {
        return axiosInstance.get<DetailResponse<CountriesData>>(
            `/countries/${id}`
        );
    },

    createCountry: (payload: CreateCountryPayload) => {
        return axiosInstance.post<DetailResponse<CountriesData>>(
            '/countries',
            payload
        );
    },

    updateCountry: (id: CountriesData['id'], payload: UpdateCountryPayload) => {
        return axiosInstance.put(`/countries/${id}`, payload);
    },

    deleteCountry: (id: CountriesData['id']) => {
        return axiosInstance.delete(`/countries/${id}`);
    },
};
