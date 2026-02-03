export interface CreateTrackTypePayload {
    name: string;
    code: string;
    isDefault: boolean;
}

export interface UpdateTrackTypePayload
    extends Partial<CreateTrackTypePayload> {}
