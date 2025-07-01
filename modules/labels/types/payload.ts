export interface CreateLabelPayload {
    picture: string | null;
    name: string;
    description: string;
}

export interface UpdateLabelPayload extends Partial<CreateLabelPayload> {}
