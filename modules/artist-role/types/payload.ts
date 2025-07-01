export interface CreateArtistRolePayload {
    name: string;
}

export interface UpdateArtistRolePayload
    extends Partial<CreateArtistRolePayload> {}
