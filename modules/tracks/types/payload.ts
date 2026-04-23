import { AudioFileBucket } from '@/modules/upload/types/data';
import { CommonFunction } from '@/types/api';
import { Key } from 'react';
import { TrackData } from '.';

export interface TrackPayload {
    title: string;
    releaseId: string;
    audioFileDraft: AudioFileBucket;
}

export interface UpdateTrackPayload extends Partial<TrackData> {}

export interface BulkUpdateTrackPayload extends CommonFunction {
    trackDrafts: Partial<TrackData>[];
}

export interface UpdateTrackPolicy extends CommonFunction {
    id: TrackData['id'];
    trackPolicyId: string;
    actionId: string;
}

export interface DeleteTracksPayload extends CommonFunction {
    ids: Key[];
}

export interface GenerateIsrc extends CommonFunction {
    trackId: string;
}
