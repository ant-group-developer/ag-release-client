export interface CreateTrackOriginTypePayload {
    name: string;
    code: string;
}

export interface UpdateTrackOriginTypePayload
    extends Partial<CreateTrackOriginTypePayload> {}
