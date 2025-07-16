export interface CreateTrackOriginTypePayload {
    name: string;
    value: string;
}

export interface UpdateTrackOriginTypePayload
    extends Partial<CreateTrackOriginTypePayload> {}
