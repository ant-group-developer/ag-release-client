export interface CreateArtistRolePayload {
    name: string;
    code: string;
    isRequired: boolean;
}

export interface UpdateArtistRolePayload
    extends Partial<CreateArtistRolePayload> {}
