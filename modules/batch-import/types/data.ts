import { CommonParams } from '@/types/api';

export interface BatchImportLogData {
    id: string;
    batchId: string;
    releaseFolder: string;
    status: string;
    excelData: Record<string, unknown>[] | null;
    storageKeys: string[] | null;
    errors: string[] | null;
    createdAt: string;
    updatedAt: string;
}

export interface BatchImportLogFilter extends CommonParams {
    batchId?: string;
    status?: string;
}
