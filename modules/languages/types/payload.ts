export interface CreateLanguagePayload {
    name: string;
    code: string;
}

export interface UpdateLanguagePayload extends Partial<CreateLanguagePayload> {}
