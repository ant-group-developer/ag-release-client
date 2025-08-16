export interface CreateTrackTypePayload {
    name: string;
    code: string;
}

export interface UpdateTrackTypePayload
    extends Partial<CreateTrackTypePayload> {}
