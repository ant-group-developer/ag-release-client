import axiosAuth from '@/api/axios-auth';
import { PaginationResponse } from '@/types/api';
import { ArtistRoleData } from '../types';

export const artistRoleApi = {
    getList: () => {
        return axiosAuth.get<PaginationResponse<ArtistRoleData>>('');
    },
};
