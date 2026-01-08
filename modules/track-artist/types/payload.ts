export interface CreateTrackArtistPayload {
    // artistRoleId: string; on removing
    artistId: string;
    trackId: string;
}

export interface UpdateTrackArtistPayload
    extends Partial<CreateTrackArtistPayload> {}
