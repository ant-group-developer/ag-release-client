import { CommonFunction } from '@/types/api';
import { IssueLevelData } from '.';

export interface CreateIssueLevelPayload extends Partial<IssueLevelData> {}

export interface UpdateIssueLevelPayload extends CreateIssueLevelPayload {}

export interface BulkUpdateIssueLevelPayload extends CommonFunction {
    issueLevels: {
        id: string;
        severityRank: number;
    }[];
}
