import { AudioFileBucket } from '@/modules/upload/types/data';
import { CommonFunction } from '@/types/api';
import { TrackData } from '.';

export interface TrackPayload {
    title: string;
    releaseId: string;
    audioFileDraft: AudioFileBucket;
}

export interface UpdateTrackPayload extends Partial<TrackData> {}

export interface UpdateTrackOrderPayload extends CommonFunction {
    trackDrafts: {
        id: string;
        order: number;
    }[];
}
