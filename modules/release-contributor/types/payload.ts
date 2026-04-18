export interface CreateReleaseContributorPayload {
    artistRoleId: string;
    artistId: string;
    releaseId: string;
    addContributorToTracks: boolean;
}

export interface UpdateReleaseContributorPayload
    extends Partial<CreateReleaseContributorPayload> {}

export interface BulkCreateReleaseContributorPayload {
    items: CreateReleaseContributorPayload[];
}
