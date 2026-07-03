import { YOUTUBE_KEY_STATUS } from '../enums';

export interface CreateYoutubeKeyPayload {
    alias: string;
    apiKey: string;
    dailyQuotaLimit: number;
}

export interface UpdateYoutubeKeyPayload {
    alias: string;
    status?: YOUTUBE_KEY_STATUS;
    dailyQuotaLimit?: number;
}
