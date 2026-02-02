import { SftpMetadata } from '@/modules/aggregator/types';

export interface TestSftpConnectionPayload extends SftpMetadata {}

export interface TestSftpConnectionByIdPayload extends Partial<SftpMetadata> {
    id: string;
}
