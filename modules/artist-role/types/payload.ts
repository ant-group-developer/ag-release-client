export interface CreateArtistRolePayload {
    name: string;
    code: string;
}

export interface UpdateArtistRolePayload
    extends Partial<CreateArtistRolePayload> {}
