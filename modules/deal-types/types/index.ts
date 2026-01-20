import { CommonAttribute, CommonParams } from '@/types/api';

export interface DealTypeData extends CommonAttribute {
    creatorId: string;
    modifierId: string;
    code: string;
    name: string;
    requiresConnection: boolean;
}

export interface DealTypeDataFilter extends CommonParams {}
