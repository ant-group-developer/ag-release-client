export interface CreateTrackOriginTypePayload {
    name: string;
}

export interface UpdateTrackOriginTypePayload
    extends Partial<CreateTrackOriginTypePayload> {}
