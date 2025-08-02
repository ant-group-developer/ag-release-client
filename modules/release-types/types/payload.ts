export interface CreateReleaseTypePayload {
    name: string;
    value: string;
}

export interface UpdateReleaseTypePayload
    extends Partial<CreateReleaseTypePayload> {}
