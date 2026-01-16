import { UserDetail } from '@/modules/user/types/data';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface AggregatorData extends CommonAttribute {
    creatorId: string;
    creator: Pick<UserDetail, 'id' | 'name' | 'email'>;
    modifierId: string;
    code: string;
    name: string;
    contactEmail: string;
    distributionChannels: DistributionChannel[];
}

export interface AggregatorDataFilter extends CommonParams {}

export interface DistributionChannel {
    tenantId: string;
    dspId: string;
    protocol: string;
    isSystemDefault: boolean;
    isActive: boolean;
    credentials: Credentials;
}

export interface Credentials {
    host: string;
    port: number;
    username: string;
    password: string;
    path: string;
}
