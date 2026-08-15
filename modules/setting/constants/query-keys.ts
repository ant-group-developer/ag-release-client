import { QUERY_KEY } from '@/constants/query-key';

export const settingQueryKeys = {
    all: [QUERY_KEY.SETTING.KEY],
    details: () =>
        [...settingQueryKeys.all, QUERY_KEY.SETTING.GET_SETTING] as const,
    detail: (id: string) => [...settingQueryKeys.details(), id] as const,
    updates: () => [...settingQueryKeys.all, QUERY_KEY.SETTING.UPDATE] as const,
    update: (id: string) => [...settingQueryKeys.updates(), id] as const,
    detailsPublic: () =>
        [
            ...settingQueryKeys.all,
            QUERY_KEY.SETTING.GET_SETTING_PUBLIC,
        ] as const,
};

export const releaseCiStatusSyncQueryKeys = {
    all: ['RELEASE_CI_STATUS_SYNC'] as const,
    schedule: () => [...releaseCiStatusSyncQueryKeys.all, 'SCHEDULE'] as const,
    update: () => [...releaseCiStatusSyncQueryKeys.all, 'UPDATE'] as const,
    runNow: () => [...releaseCiStatusSyncQueryKeys.all, 'RUN_NOW'] as const,
};

