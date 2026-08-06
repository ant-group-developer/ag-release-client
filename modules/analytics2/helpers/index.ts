import { ANALYTICS_ENTITY_TYPE, ANALYTICS_RELEASE_TYPE } from '../enums';
import { ANALYTICS_VIEW_TYPE } from '../enums/tabs';
import { ActiveAnalyticsEntity, RankingParams } from '../types';

export const createViewMoreHref = (
    pathname: string,
    params: Record<string, any>
) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            searchParams.set(key, String(value));
        }
    });

    return `${pathname}?${searchParams.toString()}`;
};

export const getAnalyticsViewType = (type: string | null) =>
    Object.values(ANALYTICS_VIEW_TYPE).includes(type as ANALYTICS_VIEW_TYPE)
        ? (type as ANALYTICS_VIEW_TYPE)
        : ANALYTICS_VIEW_TYPE.VIEW;

export const getAnalyticsReleaseType = (releaseType: string | null) =>
    Object.values(ANALYTICS_RELEASE_TYPE).includes(
        releaseType as ANALYTICS_RELEASE_TYPE
    )
        ? (releaseType as ANALYTICS_RELEASE_TYPE)
        : ANALYTICS_RELEASE_TYPE.ALL;

/**
 * The subset of ranking/revenue request params that identify *what the numbers
 * are filtered by*. Both `RankingParams` and `RevenueQueryParams` declare all of
 * these, so the same bag can be spread into either kind of request.
 */
export type AnalyticsScopeParams = Pick<
    RankingParams,
    | 'trackId'
    | 'isrc'
    | 'releaseId'
    | 'tenantId'
    | 'labelId'
    | 'pgDspId'
    | 'dspReportId'
    | 'artistId'
    | 'channelId'
    | 'sourceType'
>;

/**
 * Maps the selected entity to the request params that scope a ranking to it.
 *
 * This is deliberately independent of *which* ranking is being requested: the
 * entity says "inside this workspace", the caller decides whether that means
 * top releases or top tracks.
 */
export const getAnalyticsScopeParams = (
    entity?: ActiveAnalyticsEntity
): AnalyticsScopeParams => {
    if (!entity?.id) {
        return {};
    }

    switch (entity.type) {
        case ANALYTICS_ENTITY_TYPE.TRACK:
            return { trackId: entity.id, isrc: entity.id };
        case ANALYTICS_ENTITY_TYPE.RELEASE:
        case ANALYTICS_ENTITY_TYPE.RELEASE_VIDEO:
            return { releaseId: entity.id };
        case ANALYTICS_ENTITY_TYPE.WORKSPACE:
            return { tenantId: entity.id };
        case ANALYTICS_ENTITY_TYPE.LABEL:
            return { labelId: entity.id };
        case ANALYTICS_ENTITY_TYPE.DSP:
            return {
                pgDspId: entity.id,
                dspReportId: entity.entitySubId || entity.id,
            };
        case ANALYTICS_ENTITY_TYPE.ARTIST:
            return { artistId: entity.id };
        case ANALYTICS_ENTITY_TYPE.CHANNEL:
            return { channelId: entity.id };
        case ANALYTICS_ENTITY_TYPE.SOURCE_TYPE:
            return { sourceType: entity.id };
        default:
            return {};
    }
};

