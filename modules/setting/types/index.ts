import { RELEASES_STATUS } from '@/modules/releases/enums';
import { CommonParams } from '@/types/api';

export interface SettingData {
    id: string;
    createdAt: string;
    updatedAt: string;
    config: SettingConfig;
}

export interface SettingConfig {
    auth0: Auth0Config;
    track: TrackConfig;
    general: GeneralConfig;
    website: WebsiteConfig;
    acrCloud: ACRCloudConfig;
    telegram: TelegramConfig;
    generator: GeneratorConfig;
    backupDatabase: BackupDatabaseConfig;
    other?: OtherConfig;
}

export interface OtherConfig {
    fileCiTemplateId?: string;

    excelDataStartRow?: number | null;
}

export interface Auth0Config {
    domain: string;
    audience: string;
    clientId: string;
    clientSecret: string;
    timeSyncData: string;
    connectionName: string;
}

export interface TrackConfig {
    preview: number;
    sampleLength: number;
}

export interface SettingDataFilter extends CommonParams {}

export interface GeneratorConfig {
    prefixUpcDefaultId: string;
    prefixIsrcDefaultId: string;
    DDEX_PARTY_ID_SENDER: string;
    DDEX_PARTY_NAME_SENDER: string;
}

// Website config
export interface WebsiteConfig {
    logo: string;
    name: string;
    title: string;
    description: string;
}

export interface GeneralConfig {
    sampleLength: number;
    preview: number;
}

export interface BackupDatabaseConfig {
    // executeCycleType: EXECUTE_CYCLE_TYPE;

    // executeConfig: {
    //     nDays?: number; // backup mỗi N ngày
    //     nHours?: number; // backup mỗi N giờ
    //     nMinutes?: number; // backup mỗi N phút
    //     dayOfWeek?: string; // backup hàng tuần: "monday", "tuesday", ...
    //     dayOfMonth?: number; // backup hàng tháng: 1–31
    //     time?: string; // giờ thực hiện: "01:30"
    // };
    fileName: string;
    shell: string;
    cronValue: string;

    notifyOnFailed: boolean;
    notifyOnSuccess: boolean;

    toDrive: boolean;
    toGcs: boolean;
}

export enum EXECUTE_CYCLE_TYPE {
    N_MINUTES = 'n_minutes',
    HOURLY = 'hourly',
    N_HOURS = 'n_hours',
    DAILY = 'daily',
    N_DAYS = 'n_days',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
}

export interface TelegramConfig {
    token: string; // Token bot
    chatId: string; // Chat ID nhận thông báo
}

export interface ACRCloudConfig {
    acrHost: string;
    acrAccessKey: string;
    acrAccessSecret: string;
    chunkDuration: number;
    scoreWarning: number;
    autoScan: boolean;
    autoScanTime: string;
    releaseStatusAutoScans: RELEASES_STATUS[];
}
