import axiosAuth from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import { AppConfigShape, UpdateConfigPayload } from '../types';

export const appConfigApi = {
    get: () => {
        return axiosAuth.get<DetailResponse<Partial<AppConfigShape> | null>>(
            '/app-config'
        );
    },

    update: (payload: UpdateConfigPayload) => {
        return axiosAuth.put<DetailResponse<Partial<AppConfigShape> | null>>(
            `/app-config`,
            payload
        );
    },
};
