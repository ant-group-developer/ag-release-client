import { CommonFunction } from '@/types/api';

export interface DistributeRelease extends CommonFunction {
    id: string;
    code: string[];
}
