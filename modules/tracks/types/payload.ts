import { AudioFileBucket } from '@/modules/upload/types/data';
import { TrackData } from '.';

export interface TrackPayload {
    title: string;
    releaseId: string;
    audioFileDraft: AudioFileBucket;
}

export interface UpdateTrackPayload extends Partial<TrackData> {}
