import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { GenresData, GenresDataFilter, GenresSimpleData } from '../types';
import { CreateGenrePayload, UpdateGenrePayload } from '../types/payload';

export const genresApi = {
    getList: (params: GenresDataFilter) => {
        return axiosInstance.get<PaginationResponse<GenresData>>('/genres', {
            params,
        });
    },

    getListSimple: () => {
        return axiosInstance.get<DetailResponse<GenresSimpleData[]>>(
            '/genres/simple'
        );
    },

    getDetail: (id: GenresData['id']) => {
        return axiosInstance.get<DetailResponse<GenresData>>(`/genres/${id}`);
    },

    updateGenre: (id: GenresData['id'], payload: UpdateGenrePayload) => {
        return axiosInstance.put<DetailResponse<GenresData>>(
            `/genres/${id}`,
            payload
        );
    },

    createGenre: (payload: CreateGenrePayload) => {
        return axiosInstance.post<DetailResponse<GenresData>>(
            '/genres',
            payload
        );
    },

    deleteGenre: (id: GenresData['id']) => {
        return axiosInstance.delete(`/genres/${id}`);
    },
};
