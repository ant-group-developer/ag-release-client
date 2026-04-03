import { CommonFunction } from '@/types/api';
import { ReleaseDspData, ReleaseDspDataFilter } from '.';

export interface ReleaseDspPayload extends CommonFunction {
    id: string;
    params?: ReleaseDspDataFilter;
}

export interface ReleaseDspBulkUpdate extends CommonFunction {
    items: Partial<ReleaseDspData>[];
}
