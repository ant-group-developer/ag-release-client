import { UserDetail } from '@/modules/user/types/data';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface AggregatorData extends CommonAttribute {
    creatorId: string;
    creator: Pick<UserDetail, 'id' | 'name' | 'email'>;
    modifierId: string;
    code: string;
    name: string;
    contactEmail: string;
    ddexId: string;
    ddexName: string;
    isActive: boolean;
    isDefault: boolean;
    sftpConfig: {
        id: string;
        metadata: SftpMetadata;
    };
}

export interface SftpMetadata {
    host: string;
    port: number;
    username: string;
    password: string;
    path?: string;
}

export interface AggregatorDataFilter extends CommonParams {}
