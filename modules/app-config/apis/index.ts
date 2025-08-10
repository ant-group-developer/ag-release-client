import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import { AppConfigShape, UpdateConfigPayload } from '../types';

export const appConfigApi = {
    get: () => {
        return axiosInstance.get<
            DetailResponse<Partial<AppConfigShape> | null>
        >('/app-config');
    },

    update: (payload: UpdateConfigPayload) => {
        return axiosInstance.put<
            DetailResponse<Partial<AppConfigShape> | null>
        >(`/app-config`, payload);
    },
};
