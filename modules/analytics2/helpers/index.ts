import { ANALYTICS_ENTITY_TYPE, ANALYTICS_RELEASE_TYPE } from '../enums';
import { ANALYTICS_VIEW_TYPE } from '../enums/tabs';
import { ActiveAnalyticsEntity, AnalyticsFilterItem, RankingParams } from '../types';

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
    | 'dspId'
    | 'artistId'
    | 'channelId'
    | 'importSource'
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
                dspId: entity.id,
            };
        case ANALYTICS_ENTITY_TYPE.ARTIST:
            return { artistId: entity.id };
        case ANALYTICS_ENTITY_TYPE.CHANNEL:
            return { channelId: entity.id };
        case ANALYTICS_ENTITY_TYPE.SOURCE_TYPE:
            return { importSource: entity.id };
        default:
            return {};
    }
};

export const getFilterScopeParams = (
    filters?: AnalyticsFilterItem[]
): AnalyticsScopeParams => {
    if (!filters || filters.length === 0) {
        return {};
    }

    return filters.reduce<AnalyticsScopeParams>((acc, filter) => {
        const itemScope = getAnalyticsScopeParams({
            type: filter.type,
            id: filter.id,
            entitySubId: filter.entitySubId,
        });
        return { ...acc, ...itemScope };
    }, {});
};

export const getCombinedAnalyticsScopeParams = (
    activeEntity?: ActiveAnalyticsEntity,
    filters?: AnalyticsFilterItem[]
): AnalyticsScopeParams => {
    const entityScope = getAnalyticsScopeParams(activeEntity);
    const filterScope = getFilterScopeParams(filters);

    return {
        ...entityScope,
        ...filterScope,
    };
};


export type DemographicsDimension = 'device' | 'gender' | 'age';

const DEMOGRAPHICS_AGE_LABELS: Record<string, string> = {
    AGE_13_17: '13–17',
    AGE_18_24: '18–24',
    AGE_25_34: '25–34',
    AGE_35_44: '35–44',
    AGE_45_54: '45–54',
    AGE_55_64: '55–64',
    AGE_65_: '65+',
};

const DEMOGRAPHICS_DEVICE_I18N_KEYS: Record<string, string> = {
    'mobile phone': 'mobilePhone',
    tv: 'tv',
    tablet: 'tablet',
    computer: 'computer',
    'game console': 'gameConsole',
    unknown: 'unknown',
};

const DEMOGRAPHICS_GENDER_I18N_KEYS: Record<string, string> = {
    M: 'male',
    F: 'female',
    U: 'unknown',
};

export const formatDemographicsLabel = (
    dimensionValue: string,
    kind: DemographicsDimension,
    t: (key: string) => string
): string => {
    if (kind === 'age') {
        return DEMOGRAPHICS_AGE_LABELS[dimensionValue] ?? dimensionValue;
    }

    if (kind === 'gender') {
        const genderKey = DEMOGRAPHICS_GENDER_I18N_KEYS[dimensionValue];
        return genderKey
            ? t(`analytics2.demographics.gender.${genderKey}`)
            : dimensionValue;
    }

    const deviceKey =
        DEMOGRAPHICS_DEVICE_I18N_KEYS[dimensionValue.toLowerCase()];
    return deviceKey
        ? t(`analytics2.demographics.device.${deviceKey}`)
        : dimensionValue;
};

