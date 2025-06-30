import axiosAuth from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { GenresData, GenresDataFilter } from '../types';
import { CreateGenrePayload, UpdateGenrePayload } from '../types/payload';

export const genresApi = {
    getList: (params: GenresDataFilter) => {
        return axiosAuth.get<PaginationResponse<GenresData>>('/genres', {
            params,
        });
    },

    getDetail: (id: GenresData['id']) => {
        return axiosAuth.get<DetailResponse<GenresData>>(`/genres/${id}`);
    },

    updateGenre: (id: GenresData['id'], payload: UpdateGenrePayload) => {
        return axiosAuth.put<DetailResponse<GenresData>>(
            `/genres/${id}`,
            payload
        );
    },

    createGenre: (payload: CreateGenrePayload) => {
        return axiosAuth.post<DetailResponse<GenresData>>('/genres', payload);
    },

    deleteGenre: (id: GenresData['id']) => {
        return axiosAuth.delete(`/genres/${id}`);
    },
};
