import { CommonParams } from '@/types/api';

export interface PgDspsSyncData {
    pgUuid: string;
    dspCode: string;
    dspName: string;
    dspCiCode: string;
    picture?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface PgDspsSyncDataFilter extends CommonParams {}

export interface DspReportData {
    idDspsReport: string;
    pgUuid: string;
    dspName: string;
    source: string;
    createdAt: string;
    updatedAt: string;
    pgDspsSync?: PgDspsSyncData | null;
    pendingReleasesCount?: number;
}

export interface DspReportDataFilter extends CommonParams {
    source?: string;
    pgUuid?: string;
    status?: string;
}
