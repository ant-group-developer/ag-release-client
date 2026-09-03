import { TenantData } from '@/modules/tenant/types/data';
import { UserData } from '@/modules/user/types/data';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface ChannelsData extends CommonAttribute {
    name: string;
    tenantId: string;
    status?: string | null;
    error?: string | null;
    youtubeChannelId?: string | null;
    thumbUrl?: string | null;
    existedOnVevoBackstage?: boolean | null;
    isActive?: boolean | null;
    tenant?: Pick<TenantData, 'id' | 'name'>;
    histories?: ChannelHistoryData[];
    historyCount?: number;
    historiesCount?: number;
}

export interface ChannelHistoryData extends CommonAttribute {
    userId: string;
    channelId: string;
    channel: Omit<
        ChannelsData,
        'histories' | 'historyCount' | 'historiesCount'
    >;
    effectiveDate?: string | null;
    revenueEffectiveFrom?: string | null;
    fromTenantId?: string | null;
    toTenantId?: string | null;
}

export interface ChannelTransferModalData extends ChannelsData {
    destTenantId?: string;
}

export interface ChannelTransferSharedIsrc {
    isrc: string;
    channel_release_id: string;
    other_release_id: string;
    src: string;
}

export interface ChannelTransferBlockingRelease {
    releaseId: string;
    currentEffectiveFrom: string;
    currentRevenueEffectiveFrom: string;
}

export interface ChannelTransferPreview {
    mode: 'identity' | 'assets_only' | 'first_assign';
    fromTenantId: string | null;
    channelId?: string;
    channelName?: string;
    totalReleaseCount: number;
    releasesToTransferCount: number;
    skippedAlreadyDestCount: number;
    labelsToClear: string[];
    baselineCreatedCount: number;
    blockingReleases: ChannelTransferBlockingRelease[];
    blockingSharedIsrcs: ChannelTransferSharedIsrc[];
    maxCurrentEffectiveFrom: string;
    maxCurrentRevenueEffectiveFrom: string;
}

export interface ChannelsSimpleData
    extends Pick<ChannelsData, 'id' | 'name' | 'tenantId'> {}

export interface ChannelAccessData extends Partial<CommonAttribute> {
    userId?: string;
    channelId?: string;
    tenantId?: string;
    user?: Pick<UserData, 'id' | 'name' | 'email' | 'avatar'>;
}

export interface UserChannelData extends CommonAttribute {
    userId: string;
    channelId: string;
    tenantId?: string;
    channel: ChannelsData;
}

export interface ChannelDataFilter extends CommonParams {
    keyword?: string;
    dateCreated?: string;
    tenantId?: string;
    status?: string;
    isActive?: boolean | string;
}

export interface YoutubeChannelSyncRun extends CommonAttribute {
    actorId: string;
    force: boolean;
    totalChannels: number;
    processedChannels: number;
    updatedChannels: number;
    updatedFields: number;
    noChangeChannels: number;
    missingYoutubeChannelId: number;
    notFoundOnYoutube: number;
    failedChannels: number;
    errors: string[];
    completedAt: string | null;
}

export interface YoutubeChannelSyncRunLog extends CommonAttribute {
    channelId: string;
    runId: string;
    youtubeChannelId: string;
    actorId: string;
    force: boolean;
    fieldName: string;
    previousValue: string | null;
    nextValue: string | null;
    channel?: Pick<ChannelsData, 'id' | 'name' | 'thumbUrl'>;
}

export interface YoutubeChannelSyncRunFilter extends CommonParams {}

export interface YoutubeChannelSyncRunLogFilter extends CommonParams {
    runId: string;
}
