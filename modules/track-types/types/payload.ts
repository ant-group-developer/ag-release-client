export interface CreateTrackTypePayload {
    name: string;
    value: string;
}

export interface UpdateTrackTypePayload
    extends Partial<CreateTrackTypePayload> {}
