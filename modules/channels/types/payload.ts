export interface CreateChannelPayload {
    name: string;
    tenantId: string;
}

export interface UpdateChannelPayload extends Partial<CreateChannelPayload> {}
