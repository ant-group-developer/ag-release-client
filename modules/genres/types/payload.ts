import { GENRE_SCOPE } from '../enums';

export interface CreateGenrePayload {
    name: string;
    code: string;
    picture?: string | null;
    description?: string;
    scope?: GENRE_SCOPE;
}

export interface UpdateGenrePayload extends Partial<CreateGenrePayload> {}


