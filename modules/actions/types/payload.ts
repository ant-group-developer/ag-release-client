export interface CreateActionPayload {
    name: string;
    code: string;
    note: string;
}

export interface UpdateActionPayload extends Partial<CreateActionPayload> {}
