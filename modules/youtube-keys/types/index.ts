import { CommonAttribute, CommonParams } from '@/types/api';

export interface YoutubeKeyData extends CommonAttribute {
    alias: string;
    keyHint: string;
    status: string;
    dailyQuotaLimit: number;
    unitsConsumedToday: number;
    unitsRemaining: number;
    lastResetAt: string;
    lastUsedAt: string;
    lastError: string | null;
    consecutiveErrorCount: number;
}

export interface YoutubeKeyDataFilter extends CommonParams {
    keyword?: string;
    status?: string;
}

export * from './payload';
