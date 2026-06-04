export interface CreateReleaseArtistPayload {
    // artistRoleId: string;
    artistId: string;
    releaseId: string;
    addArtistToTracks: boolean;
}

export interface UpdateReleaseArtistPayload
    extends Partial<CreateReleaseArtistPayload> {}

export interface BulkCreateReleaseArtistPayload {
    items: CreateReleaseArtistPayload[];
}
