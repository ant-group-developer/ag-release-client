import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import { SettingData } from '../types';
import { UpdateSettingPayload } from '../types/payload';

export const settingApis = {
    getSetting: () => {
        return axiosInstance.get<DetailResponse<SettingData>>('/app-config/v2');
    },

    getSettingPublic: () => {
        return axiosInstance.get<DetailResponse<SettingData>>(
            '/app-config/v2/public'
        );
    },

    updateSetting: (payload: UpdateSettingPayload) => {
        return axiosInstance.put<DetailResponse<SettingData>>(
            '/app-config/v2',
            payload
        );
    },

    refreshCiToolToken: () => {
        return axiosInstance.post<DetailResponse<any>>(
            '/app-config/v2/refresh-ci-tool-token'
        );
    },

    testCiToken: () => {
        return axiosInstance.post<DetailResponse<any>>(
            '/app-config/v2/test-ci-token'
        );
    },
};

export const releaseCiStatusSyncApis = {
    getSchedule: () => {
        return axiosInstance.get<DetailResponse<import('../types').ReleaseCiStatusSyncSchedule>>(
            '/release-ci-status-sync/schedule'
        );
    },

    updateSchedule: (payload: import('../types').UpdateReleaseCiStatusSyncSchedulePayload) => {
        return axiosInstance.put<DetailResponse<import('../types').ReleaseCiStatusSyncSchedule>>(
            '/release-ci-status-sync/schedule',
            payload
        );
    },

    runNow: () => {
        return axiosInstance.post<DetailResponse<import('../types').ReleaseCiStatusSyncSummary>>(
            '/release-ci-status-sync/run-now'
        );
    },
};


export async function getSettingPublicServer() {
    try {
        const API_BASE = (process.env.API_URL ?? '').replace(/\/+$/, '');
        const url = `${API_BASE}/app-config/v2/public`;

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
