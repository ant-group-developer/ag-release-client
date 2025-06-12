import { CommonParams } from '@/types/api';

export interface ArtistData {
    id: string;
    name: string;
    role: string;
    artistId: string;
    thumbnail: string;
    trackCount: number;
    createdAt: Date;
}

export interface ArtistDataFilter extends CommonParams {
    dateCreated?: string;
}
