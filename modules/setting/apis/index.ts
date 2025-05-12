import axiosAuth from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import { SettingData, SettingDataPublic, SettingPayload } from '../types';

export const settingApi = {
    createSetting: () => {
        return axiosAuth.post<DetailResponse<SettingData>>('/config');
    },

    updateSetting: (payload: SettingPayload) => {
        return axiosAuth.patch<DetailResponse<SettingData>>(`/config`, payload);
    },

    getSettingPublic: () => {
        return axiosAuth.get<DetailResponse<SettingDataPublic>>(
            `/config/public-config`
        );
    },

    getSettingPrivate: () => {
        return axiosAuth.get<DetailResponse<SettingData>>(
            `/config/private-config`
        );
    },

    genColumnCodeSort: () => {
        return axiosAuth.post('/config/gen-column-code-sort');
    },
};
