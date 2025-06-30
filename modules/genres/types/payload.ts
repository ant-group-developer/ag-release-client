export interface CreateGenrePayload {
    name: string;
    picture?: string | null;
    description?: string;
}

export interface UpdateGenrePayload extends Partial<CreateGenrePayload> {}
