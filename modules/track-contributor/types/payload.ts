export interface CreateTrackContributorPayload {
    artistRoleId: string;
    artistId: string;
    trackId: string;
}

export interface UpdateTrackContributorPayload
    extends Partial<CreateTrackContributorPayload> {}
