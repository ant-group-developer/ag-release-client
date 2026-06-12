export interface CreateChannelPayload {
    name: string;
    tenantId: string;
    youtubeChannelId?: string;
    thumbId?: string;
}

export interface UpdateChannelPayload extends Partial<CreateChannelPayload> {}
