import { DspData } from '@/modules/dsp/types';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface ArtistData extends CommonAttribute {
    name: string;
    picture?: string | null;
    biography: string;
    creatorId: string;
    modifierId?: string;
    releaseCount: number;
    trackCount: number;
    code: string;
    artistProfiles?: ArtistProfileData[];
}
export interface ArtistDataSimple
    extends Pick<ArtistData, 'id' | 'name' | 'code' | 'artistProfiles'> {}

export interface ArtistProfileData extends CommonAttribute {
    name: string;
    url: string;
    dspId: string;
    artistId: string;
    dsp: DspData;
}

export interface ArtistDataFilter extends CommonParams {
    artistId?: string;
}
