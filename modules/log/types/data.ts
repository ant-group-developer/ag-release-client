import { CommonAttribute, CommonParams } from '@/types/api';
import { LOG_LEVEL, LOG_TYPE } from '../enums';

export interface DataFilterLogs extends CommonParams {
    level?: string;
    type?: string;
    modules?: string;
    releaseSubmitId?: string;
    releaseSubmitStepId?: string;
    fieldOrder?: string;
}

export interface LogsData extends CommonAttribute {
    level: LOG_LEVEL;
    type: LOG_TYPE;
    module: string;
    message: string;
    releaseSubmitId: string | null;
    releaseSubmitStepId: string | null;
    data: any;
}
