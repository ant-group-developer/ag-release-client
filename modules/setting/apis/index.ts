import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import { SettingData } from '../types';
import { UpdateSettingPayload } from '../types/payload';

export const settingApis = {
    getSetting: () => {
        return axiosInstance.get<DetailResponse<SettingData>>('/app-config');
    },

    updateSetting: (payload: UpdateSettingPayload) => {
        return axiosInstance.put<DetailResponse<SettingData>>(
            '/app-config',
            payload
        );
    },
};
