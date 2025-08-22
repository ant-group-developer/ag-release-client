import { CommonAttribute } from '@/types/api';

export interface BackupDatabaseLogData extends CommonAttribute {
    status: string;
    urlDrive: string;
    urlGcs: string;
    fileName: string;
    fileSize: string;
    elapsedTime: string;
}
