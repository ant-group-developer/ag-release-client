export interface CreateChannelPayload {
    name: string;
    tenantId: string;
    youtubeChannelId?: string;
    thumbUrl?: string;
    existedOnVevoBackstage?: boolean;
    isActive?: boolean;
}

export interface UpdateChannelPayload extends Partial<CreateChannelPayload> {}

export interface TransferChannelTenantPayload {
    tenantId: string;
    effectiveDate: string;
    revenueEffectiveFrom: string;
}
