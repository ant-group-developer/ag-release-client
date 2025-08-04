export interface CreateArtistRolePayload {
    name: string;
    value: string;
}

export interface UpdateArtistRolePayload
    extends Partial<CreateArtistRolePayload> {}
