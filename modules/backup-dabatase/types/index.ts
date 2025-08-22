import { CommonAttribute, CommonParams } from '@/types/api';

export interface BackupDatabaseLogData extends CommonAttribute {
    status: string;
    urlDrive: string;
    urlGcs: string;
    fileName: string;
    fileSize: string;
    elapsedTime: string;
}

export interface BackupDatabaseLogDataFilter extends CommonParams {}
