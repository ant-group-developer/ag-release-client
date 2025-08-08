import { CommonFunction } from '@/types/api';

export interface CreateArtistPayload {
    name: string;
    picture?: string | null;
    biography: string;
}

export interface UpdateArtistPayload extends Partial<CreateArtistPayload> {}

export interface DeleteArtistProfiles extends CommonFunction {
    artistId: string;
    profileId: string;
}
