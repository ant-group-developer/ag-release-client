import { RELEASES_STATUS, RELEASES_TYPE } from '@/modules/releases/enums';
import { CommonParams } from '@/types/api';
import { GENRES } from '../enums';

export interface TrackData {
    id: string;
    title: string;
    trackId: string;
    genres: GENRES;
    labelName: string;
    isrc: string;
    creationDate: string;
    releaseDate: string;
    duration: number;
    thumbnail: string;
    artist: string;
    plays: number;
    file: File;
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
