import axiosAuth from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { CountriesData, CountriesDataFilter } from '../types';
import { CreateCountryPayload, UpdateCountryPayload } from '../types/payload';

export const countriesApi = {
    getList: (params: CountriesDataFilter) => {
        return axiosAuth.get<PaginationResponse<CountriesData>>('/country', {
            params,
        });
    },
    getDetail: (id: CountriesData['id']) => {
        return axiosAuth.get<DetailResponse<CountriesData>>(`/country/${id}`);
    },

    createCountry: (payload: CreateCountryPayload) => {
        return axiosAuth.post<DetailResponse<CountriesData>>(
            '/country',
            payload
        );
    },

    updateCountry: (id: CountriesData['id'], payload: UpdateCountryPayload) => {
        return axiosAuth.patch(`/country/${id}`, payload);
    },

    deleteCountry: (id: CountriesData['id']) => {
        return axiosAuth.delete(`/country/${id}`);
    },
};
