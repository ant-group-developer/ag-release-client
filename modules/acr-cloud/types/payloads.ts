import { TrackData } from '@/modules/tracks/types';
import { CommonFunction } from '@/types/api';

export interface ScanTracksPayload extends CommonFunction {
    filter: {
        tracksIds: TrackData['id'][];
        trackCreatedAtStart: string;
        trackCreatedAtEnd: string;
        ignoreTrackScanned: boolean;
    };
}
