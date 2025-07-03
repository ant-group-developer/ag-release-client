export interface CreateTimezonePayload {
    name: string;
    utc: string;
    zone: string;
}

export interface UpdateTimezonePayload extends Partial<CreateTimezonePayload> {}
