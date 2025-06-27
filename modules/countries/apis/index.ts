import axiosAuth from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { CountriesData, CountriesDataFilter } from '../types';
import { CreateCountryPayload, UpdateCountryPayload } from '../types/payload';

export const countriesApi = {
    getList: (params: CountriesDataFilter) => {
        return axiosAuth.get<PaginationResponse<CountriesData>>('/countries', {
            params,
        });
    },
    getDetail: (id: CountriesData['id']) => {
        return axiosAuth.get<DetailResponse<CountriesData>>(`/countries/${id}`);
    },

    createCountry: (payload: CreateCountryPayload) => {
        return axiosAuth.post<DetailResponse<CountriesData>>(
            '/countries',
            payload
        );
    },

    updateCountry: (id: CountriesData['id'], payload: UpdateCountryPayload) => {
        return axiosAuth.put(`/countries/${id}`, payload);
    },

    deleteCountry: (id: CountriesData['id']) => {
        return axiosAuth.delete(`/countries/${id}`);
    },
};
