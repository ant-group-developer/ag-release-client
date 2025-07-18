export interface CreateReleaseArtistPayload {
    artistRoleId: string;
    artistId: string;
    releaseId: string;
}

export interface UpdateReleaseArtistPayload
    extends Partial<CreateReleaseArtistPayload> {
    addArtistToTracks?: boolean;
}
