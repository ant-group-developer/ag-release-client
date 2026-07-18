import { UserDetail } from '@/modules/user/types/data';
import { CommonAttribute, CommonParams } from '@/types/api';
import { ERN_VERSION } from '../enums';

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
    createsDoneFolder: boolean;
    deliveryEmail?: string;
    deliveryEmailSubject?: string;
    manualUploadUrl?: string;
    sftpConfig: {
        id: string;
        ernVersion?: ERN_VERSION;
        metadata: SftpMetadata;
    };
}

export interface SftpMetadata {
    type?: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    privateKey?: string;
    path?: string;
    // S3 only
    bucket?: string;
    region?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    endpoint?: string;
}

export interface AggregatorDataFilter extends CommonParams {}
