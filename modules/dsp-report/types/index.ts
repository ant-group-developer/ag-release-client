import { CommonParams } from '@/types/api';

export interface PgDspsSyncData {
    pgUuid: string;
    dspCode: string;
    dspName: string;
    dspCiCode: string;
    createdAt: string;
    updatedAt: string;
}

export interface DspReportData {
    idDspsReport: string;
    pgUuid: string;
    dspName: string;
    source: string;
    createdAt: string;
    updatedAt: string;
    pgDspsSync?: PgDspsSyncData | null;
}

export interface DspReportDataFilter extends CommonParams {
    source?: string;
    pgUuid?: string;
}
