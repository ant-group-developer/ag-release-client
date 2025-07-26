export interface CreateTrackArtistPayload {
    artistRoleId: string;
    artistId: string;
    trackId: string;
}

export interface UpdateTrackArtistPayload
    extends Partial<CreateTrackArtistPayload> {}
