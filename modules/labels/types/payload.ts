export interface CreateLabelPayload {
    picture: string;
    name: string;
    description: string;
}

export interface UpdateLabelPayload extends Partial<CreateLabelPayload> {}
