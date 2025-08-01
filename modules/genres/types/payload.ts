export interface CreateGenrePayload {
    name: string;
    value: string;
    picture?: string | null;
    description?: string;
}

export interface UpdateGenrePayload extends Partial<CreateGenrePayload> {}
