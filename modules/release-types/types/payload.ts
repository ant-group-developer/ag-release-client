export interface CreateReleaseTypePayload {
    name: string;
    code: string;
}

export interface UpdateReleaseTypePayload
    extends Partial<CreateReleaseTypePayload> {}
