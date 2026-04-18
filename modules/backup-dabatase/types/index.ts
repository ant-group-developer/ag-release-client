import { CommonAttribute, CommonParams } from '@/types/api';

export interface BackupDatabaseLogData extends CommonAttribute {
    status: string;
    urlDrive: string;
    urlGcs: string;
    urlFolderGcs: string;
    fileName: string;
    fileSize: string;
    elapsedTime: string;
    urlR2: string;
    urlFolderR2: string;
}

export interface BackupDatabaseLogDataFilter extends CommonParams {}
