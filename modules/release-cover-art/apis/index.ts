import axiosAuth from '@/api/axios-auth';
import { ReleaseCoverArtPayload } from '../types';

export const releaseCoverArtApi = {
    createReleaseCoverArt: (payload: ReleaseCoverArtPayload) => {
        return axiosAuth.post('/release-cover-art', payload);
    },
    deleteReleaseCoverArt: (id: string) => {
        return axiosAuth.delete(`/release-cover-art/${id}`);
    },
};
