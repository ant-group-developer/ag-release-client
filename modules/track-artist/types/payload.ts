export interface CreateTrackArtistPayload {
    artistId: string;
    trackId: string;
}

export interface UpdateTrackArtistPayload
    extends Partial<CreateTrackArtistPayload> {}
