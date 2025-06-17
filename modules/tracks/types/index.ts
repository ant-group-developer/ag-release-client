import { ArtistData } from '@/modules/artist/types';
import { RELEASES_STATUS, RELEASES_TYPE } from '@/modules/releases/enums';
import { CommonParams } from '@/types/api';
import { GENRES } from '../enums';

export interface TrackData {
    id: string;
    title: string; // Kiem tra va xoa
    trackName: string;
    trackId: string;
    genres: GENRES;
    subGenres?: GENRES;
    labelName: string;
    isrc: string;
    source?: string;
    languageTrack?: string;
    creationDate: string;
    releaseDate: string;
    duration: number;
    thumbnail: string;
    isSensitiveContent: boolean;
    countryLanguage?: string;
    metadataLanguage?: string;
    lyrics?: string;
    countryRecording?: string;
    recordingType?: string;
    artists: ArtistData[];
    plays: number;
    file: File;
    fileName: string;
    songInfo: {
        duration: number;
        peakData: number[];
    };
    fileData?: {
        fileName: string;
        metadata: {
            format: string;
            codec: string;
            bitrate: number;
            sampleRate: number;
            channels: number;
            duration: number;
            bitDepth: number;
            mqs: string;
        };
    };
}

export interface TrackDataFilter extends CommonParams {
    type?: RELEASES_TYPE;
    status?: RELEASES_STATUS;
    startDateCreated?: string;
    endDateCreated?: string;
    startDateRelease?: string;
    endDateRelease?: string;
    genres?: string;
}
