import { AudioFileBucket } from '@/modules/upload/types/data';

export interface trackPayload {
    title: string;
    releaseId: string;
    audioFileDraft: AudioFileBucket;
}
