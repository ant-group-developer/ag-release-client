export interface CreateReleaseContributorPayload {
    artistRoleId: string;
    artistId: string;
    releaseId: string;
    addArtistToTracks: boolean;
}

export interface UpdateReleaseContributorPayload
    extends Partial<CreateReleaseContributorPayload> {}
