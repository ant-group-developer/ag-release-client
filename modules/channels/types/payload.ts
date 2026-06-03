export interface CreateChannelPayload {
    name: string;
}

export interface UpdateChannelPayload extends Partial<CreateChannelPayload> {}
