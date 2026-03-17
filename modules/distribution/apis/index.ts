import axiosInstance from '@/api/axios-auth';
import { ReleasesData } from '@/modules/releases/types';

export const distributeApis = {
    distributeRelease: (id: ReleasesData['id'], code: string[]) => {
        return axiosInstance.post(`/releases/${id}/submit`, { code });
    },
};
