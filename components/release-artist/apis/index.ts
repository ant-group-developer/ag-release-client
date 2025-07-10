import axiosAuth from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import { ReleaseArtist } from '../types';
import { CreateReleaseArtistPayload } from '../types/payload';

export const releaseArtistApi = {
    createReleaseArtist: (payload: CreateReleaseArtistPayload) => {
        return axiosAuth.post<DetailResponse<ReleaseArtist>>(
            '/release-artists',
            payload
        );
    },

    deleteReleaseArtist: (id: string) => {
        return axiosAuth.delete(`/release-artists/${id}`);
    },
};
