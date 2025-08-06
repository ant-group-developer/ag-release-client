import { CommonAttribute, CommonParams } from '@/types/api';

export interface DataFilterLog extends CommonParams {
    action?: string;
    success?: string;
    date?: string;
    startDateCreated?: string;
    endDateCreated?: string;
}

export interface LogData extends CommonAttribute {
    action: string;
    ip: string | null;
    country: string | null;
    city: string | null;
    originalUrl: string | null;
    statusCode: number | null;
    content: string | null;
    response: string | null;
    email: string | null;
    creatorId: string | null;
    note: string | null;
    success: boolean;
    userAgent: string;
}

export interface LogDetail extends LogData {}
