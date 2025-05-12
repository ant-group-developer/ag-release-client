import { defaultConfig } from '@/constants/env';
import { DetailResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { settingApi } from '../apis';
import { settingQueryKeys } from '../constants';
import { SettingData, SettingDataPublic } from '../types';

export const useGetSettingPublic = () => {
    const { data, ...res } = useQuery({
        queryKey: [...settingQueryKeys.getSettingPublic],
        queryFn: () => settingApi.getSettingPublic(),
    });

    const defaultSetting: SettingDataPublic = {
        website: defaultConfig.APP_SHORT_NAME,
        logo: '',
        logoUrl: '/logo.png',
        deadline: '',
        telegramSupport: '',
        linkStartBot: '',
        guideUrl: '',
        guideFileGoogleDriveId: '',
    };

    const dataSetting: DetailResponse<SettingDataPublic>['data'] =
        data?.data.data ?? defaultSetting;

    return {
        data: dataSetting,
        ...res,
    };
};

export const useGetSettingPrivate = () => {
    const { data, ...res } = useQuery({
        queryKey: [...settingQueryKeys.getSettingPrivate],
        queryFn: () => settingApi.getSettingPrivate(),
    });

    const defaultSetting: SettingData = {
        website: defaultConfig.APP_SHORT_NAME,
        logo: '',
        logoUrl: '/logo.png',
        deadline: '',
        telegramSupport: '',
        linkStartBot: '',
        id: '',
        dateFormat: '',
        dateTimeFormat: '',
        tokenTelegramBot: '',
        google_illustrative_folder_id: '',
        google_thumbnail_folder_id: '',
        google_root_folder_id: '',
        google_oauth_scope: '',
        guideUrl: '',
        guideFileGoogleDriveId: '',
    };

    const dataSetting: DetailResponse<SettingData>['data'] =
        data?.data.data ?? defaultSetting;

    return {
        data: dataSetting,
        ...res,
    };
};
