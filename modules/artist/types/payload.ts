export interface CreateArtistPayload {
    name: string;
    picture?: string | null;
    biography: string;
}

export interface UpdateArtistPayload extends Partial<CreateArtistPayload> {}
