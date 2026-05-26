import { CommonAttribute, CommonParams } from '@/types/api';

export interface ReleaseVideo {
    videoTitle: string;
    primaryArtists: string[]; // Free-form string array
    genres: string[];         // Free-form string array
    language: string;         // Single language string
    isrc: string;
    contentProvider: string;
    repertoireOwner: string;
    channel: string;

    featuredArtists?: string[]; // Free-form string array
    isExplicit?: boolean;
    containsAiContent?: boolean;
    description?: string;
    keywords?: string[];      // Array of strings representing keywords
    isMadeForKids?: boolean;
}

export interface ReleaseVideoData extends ReleaseVideo, CommonAttribute {}

export interface ReleaseVideoDataFilter extends CommonParams {
    keyword?: string;
    dateCreated?: string;
}
