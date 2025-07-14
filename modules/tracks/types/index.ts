import { AudioFileBucket } from '@/modules/upload/types/data';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface TrackData extends CommonAttribute {
    title: string;
    picture: string | null;
    version: string | null;
    isrc: string | null;
    iswc: string | null;
    releaseId: string;
    pLineOwner: string | null;
    primaryGenreId: string | null;
    subGenreId: string | null;
    audioFileBucket?: AudioFileBucket;
    // subGenres?: GENRES;
    // labelName: string;
    // trackOrigin?: string;
    // languageTrack?: string;
    // creationDate: string;
    // releaseDate: string;
    // duration: number;
    // thumbnail: string;
    // isSensitiveContent: boolean;
    // countryLanguage?: string;
    // metadataLanguage?: string;
    // lyrics?: string;
    // countryRecording?: string;
    // recordingType?: string;
    // artists: ArtistData[];
    // plays: number;
    // file?: File;
    // fileName: string;
    // previewTrack?: string;
    // territoryType?: [];
    // songInfo: {
    //     duration: number;
    //     peakData: number[];
    // };
    // fileData?: {
    //     fileName: string;
    //     metadata: {
    //         format: string;
    //         codec: string;
    //         bitrate: number;
    //         sampleRate: number;
    //         channels: number;
    //         duration: number;
    //         bitDepth: number;
    //         mqs: string;
    //     };
    // };
}

export interface TrackDataFilter extends CommonParams {
    releaseId?: string;
}
