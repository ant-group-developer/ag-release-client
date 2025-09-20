import { ArtistData } from '@/modules/artist/types';
import { LabelData } from '@/modules/labels/types';
import { ReleasesData, TrackData } from '@/modules/releases/types';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface RevenueData extends CommonAttribute {
    date: string;
    releaseId: string;
    release: ReleasesData;
    trackId: string;
    track: TrackData;
    labelId: string;
    label: LabelData;
    artistId: string;
    artist: ArtistData;
    genreId: string;
}
export interface RevenueDataFilter extends CommonParams {}
