import axiosInstance from '@/api/axios-auth';
import { ReleaseCoverArtPayload } from '../types';

export const releaseCoverArtApi = {
    createReleaseCoverArt: (payload: ReleaseCoverArtPayload) => {
        return axiosInstance.post('/release-cover-art', payload);
    },
    deleteReleaseCoverArt: (id: string) => {
        return axiosInstance.delete(`/release-cover-art/${id}`);
    },
};
