export interface CreateTrackOriginTypePayload {
    name: string;
    code: string;
    isDefault: boolean;
}

export interface UpdateTrackOriginTypePayload
    extends Partial<CreateTrackOriginTypePayload> {}
