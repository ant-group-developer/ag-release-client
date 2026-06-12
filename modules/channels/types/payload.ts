export interface CreateChannelPayload {
    name: string;
    tenantId: string;
    youtubeChannelId?: string;
    thumbUrl?: string;
}

export interface UpdateChannelPayload extends Partial<CreateChannelPayload> {}
