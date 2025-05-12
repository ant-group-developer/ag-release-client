import { CommonFunction } from '@/types/api';

export interface SettingData {
    id: string;
    website: string;
    logoUrl: string;
    logo: string;
    dateFormat: string;
    dateTimeFormat: string;
    deadline: string | number;
    telegramSupport: string;
    tokenTelegramBot: string;
    linkStartBot: string;
    google_client_id?: string;
    google_client_secret?: string;
    google_redirect_uri?: string;
    google_illustrative_folder_id: string;
    google_thumbnail_folder_id: string;
    google_root_folder_id: string;
    google_oauth_scope: string;
    guideUrl: string;
    guideFileGoogleDriveId: string;
}

export interface SettingDataPublic
    extends Pick<
        SettingData,
        | 'website'
        | 'deadline'
        | 'logo'
        | 'logoUrl'
        | 'telegramSupport'
        | 'linkStartBot'
        | 'guideUrl'
        | 'guideFileGoogleDriveId'
    > {}

export interface SettingPayload {
    website: string;
    logo?: string | null;
    deadline?: string | number;
    telegramSupport?: string;
    tokenTelegramBot?: string;
    linkStartBot?: string;
    googleAnalytics?: string;
    googleTagManager?: string;
    statisticOrderGroupIds?: string[];
    statisticProductGroupIds?: string[];
}

export interface UpdateSetting extends CommonFunction {
    payload: SettingPayload;
}
