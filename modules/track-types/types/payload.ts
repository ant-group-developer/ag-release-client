export interface CreateTrackTypePayload {
    name: string;
}

export interface UpdateTrackTypePayload
    extends Partial<CreateTrackTypePayload> {}
