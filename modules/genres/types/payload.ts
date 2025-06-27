export interface CreateGenrePayload {
    name: string;
    picture: string;
    description?: string;
}

export interface UpdateGenrePayload extends Partial<CreateGenrePayload> {}
