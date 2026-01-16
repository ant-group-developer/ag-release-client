import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import { SettingData } from '../types';
import { UpdateSettingPayload } from '../types/payload';

export const settingApis = {
    getSetting: () => {
        return axiosInstance.get<DetailResponse<SettingData>>('/app-config');
    },

    getSettingPublic: () => {
        return axiosInstance.get<DetailResponse<SettingData>>(
            '/app-config/public'
        );
    },

    updateSetting: (payload: UpdateSettingPayload) => {
        return axiosInstance.put<DetailResponse<SettingData>>(
            '/app-config',
            payload
        );
    },
};

export async function getSettingPublicServer() {
    try {
        const API_BASE = (process.env.API_URL ?? '').replace(/\/+$/, '');
        const url = `${API_BASE}/app-config/public`;

        const res = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error('Failed to fetch public settings:', res.status);
            return null;
        }

        return await res.json();
    } catch (error) {
        console.error('Fetch public settings error:', error);
        return null;
    }
}
