import {
    ANALYTICS_ENTITY_TYPE,
    ANALYTICS_GRANULARITY,
    ANALYTICS_RELEASE_TYPE,
} from '../enums';
import { ANALYTICS_VIEW_TYPE } from '../enums/tabs';
import {
    ActiveAnalyticsEntity,
    AnalyticsCommonParams,
    AnalyticsFilterItem,
    AnalyticsScopeParams,
    AnalyticsSelectedIds,
    AnalyticsSelectionParams,
    AnalyticsSummaryV2Filters,
    AnalyticsSummaryV2Params,
    RevenueDspBarChartV2Params,
    RevenueTerBarChartV2Params,
    TrendViewDemographicsBarChartV2Params,
    TrendViewDspBarChartV2Params,
    TrendViewLineChartV2DspId,
    TrendViewLineChartV2Params,
    TrendViewTerBarChartV2Params,
} from '../types';

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
 * The params that identify *what the numbers are filtered by*. Declared once in
 * `../types` so ranking, revenue, summary and chart requests all share it.
 */
export type { AnalyticsScopeParams } from '../types';

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
                dspReportIds: entity.dspReportIds?.length
                    ? entity.dspReportIds
                    : [entity.entitySubId || entity.id].filter(
                          (value): value is string => Boolean(value)
                      ),
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
            dspReportIds: filter.dspReportIds,
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

const uniqueNonEmpty = (values: (string | undefined)[]) =>
    Array.from(new Set(values.filter((value): value is string => !!value)));

export const ANALYTICS_DSP_SELECTION_SEPARATOR = '\u001f';

const normalizeDspId = (value?: string) => {
    const normalized = value?.trim();

    return normalized && normalized !== 'undefined' && normalized !== 'null'
        ? normalized
        : undefined;
};

const normalizeDspIds = (values: (string | undefined)[]) =>
    Array.from(
        new Set(
            values
                .map(normalizeDspId)
                .filter((value): value is string => Boolean(value))
        )
    );

export const getAnalyticsDspSelectionKey = (params: {
    pgDspId?: string;
    dspReportId?: string;
    dspReportIds?: string[];
}) => {
    const dspReportIds = normalizeDspIds(
        params.dspReportIds?.length ? params.dspReportIds : [params.dspReportId]
    );
    const pgDspId = normalizeDspId(params.pgDspId) || dspReportIds[0];

    return pgDspId
        ? [pgDspId, ...dspReportIds].join(ANALYTICS_DSP_SELECTION_SEPARATOR)
        : '';
};

const toDspFilter = (value: string): TrendViewLineChartV2DspId | undefined => {
    const [rawPgDspId, ...rawDspReportIds] = value.split(
        ANALYTICS_DSP_SELECTION_SEPARATOR
    );
    const pgDspId = normalizeDspId(rawPgDspId);
    const dspReportIds = normalizeDspIds(rawDspReportIds);

    if (!pgDspId || !dspReportIds.length) {
        return undefined;
    }

    return { pgDspId, dspReportIds };
};

export const getAnalyticsV2Filters = (
    params: AnalyticsCommonParams
): AnalyticsSummaryV2Filters => {
    const tenantIds = uniqueNonEmpty([
        params.tenantId,
        ...(params.tenantIds ?? []),
    ]);
    const labelIds = uniqueNonEmpty([
        params.labelId,
        ...(params.labelIds ?? []),
    ]);
    const artistIds = uniqueNonEmpty([
        params.artistId,
        ...(params.artistIds ?? []),
    ]);
    const releaseIds = uniqueNonEmpty([
        params.releaseId,
        ...(params.releaseIds ?? []),
    ]);
    const channelIds = uniqueNonEmpty([
        params.channelId,
        ...(params.channelIds ?? []),
    ]);
    const isrcs = uniqueNonEmpty([
        params.isrc,
        params.trackId,
        ...(params.trackIds ?? []),
    ]);
    const importSources = uniqueNonEmpty([
        params.importSource,
        ...(params.importSources ?? []),
    ]);

    const directPgDspId =
        normalizeDspId(params.pgDspId) || normalizeDspId(params.dspId);
    const directDspReportIds = normalizeDspIds(
        params.dspReportIds?.length
            ? params.dspReportIds
            : [params.dspReportId || directPgDspId]
    );
    const directDspFilter =
        directPgDspId && directDspReportIds.length
            ? { pgDspId: directPgDspId, dspReportIds: directDspReportIds }
            : undefined;

    const dspIds = [...(params.dspIds ?? []).map(toDspFilter), directDspFilter]
        .filter((dsp): dsp is TrendViewLineChartV2DspId =>
            Boolean(dsp?.pgDspId && dsp.dspReportIds.length)
        )
        .filter(
            (dsp, index, list) =>
                list.findIndex(
                    (item) =>
                        item.pgDspId === dsp.pgDspId &&
                        item.dspReportIds.join('\u001e') ===
                            dsp.dspReportIds.join('\u001e')
                ) === index
        );

    return {
        ...(tenantIds.length ? { tenantIds } : {}),
        ...(labelIds.length ? { labelIds } : {}),
        ...(artistIds.length ? { artistIds } : {}),
        ...(releaseIds.length ? { releaseIds } : {}),
        ...(channelIds.length ? { channelIds } : {}),
        ...(isrcs.length ? { isrcs } : {}),
        ...(importSources.length ? { importSources } : {}),
        ...(dspIds.length ? { dspIds } : {}),
    };
};

export const getAnalyticsSummaryV2Params = (
    params: AnalyticsCommonParams
): AnalyticsSummaryV2Params => {
    return {
        fromDate: params.fromDate || '',
        toDate: params.toDate || '',
        releaseType: params.releaseType,
        filters: getAnalyticsV2Filters(params),
    };
};

export const getTrendViewDspBarChartV2Params = (
    params: AnalyticsCommonParams
): TrendViewDspBarChartV2Params => {
    return {
        fromDate: params.fromDate || '',
        toDate: params.toDate || '',
        releaseType: params.releaseType,
        filters: getAnalyticsV2Filters(params),
    };
};

export const getRevenueDspBarChartV2Params = (
    params: AnalyticsCommonParams
): RevenueDspBarChartV2Params => {
    return {
        fromDate: params.fromDate || '',
        toDate: params.toDate || '',
        releaseType: params.releaseType,
        filters: getAnalyticsV2Filters(params),
    };
};

export const getTrendViewTerBarChartV2Params = (
    params: AnalyticsCommonParams
): TrendViewTerBarChartV2Params => {
    return {
        fromDate: params.fromDate || '',
        toDate: params.toDate || '',
        releaseType: params.releaseType,
        filters: getAnalyticsV2Filters(params),
    };
};

export const getTrendViewDemographicsBarChartV2Params = (
    params: AnalyticsCommonParams
): TrendViewDemographicsBarChartV2Params => {
    return {
        fromDate: params.fromDate || '',
        toDate: params.toDate || '',
        releaseType: params.releaseType,
        filters: getAnalyticsV2Filters(params),
    };
};

export const getRevenueTerBarChartV2Params = (
    params: AnalyticsCommonParams
): RevenueTerBarChartV2Params => {
    return {
        fromDate: params.fromDate || '',
        toDate: params.toDate || '',
        releaseType: params.releaseType,
        filters: getAnalyticsV2Filters(params),
    };
};

export const getTrendViewLineChartV2Params = (
    params: AnalyticsCommonParams
): TrendViewLineChartV2Params => {
    return {
        fromDate: params.fromDate || '',
        toDate: params.toDate || '',
        releaseType: params.releaseType,
        seriesBy: 'auto',
        filters: getAnalyticsV2Filters(params),
        granularity: params.granularity || ANALYTICS_GRANULARITY.DAY,
    };
};

const selectionParamByEntityType: Record<
    string,
    keyof AnalyticsSelectionParams
> = {
    [ANALYTICS_ENTITY_TYPE.TRACK]: 'trackIds',
    [ANALYTICS_ENTITY_TYPE.RELEASE]: 'releaseIds',
    [ANALYTICS_ENTITY_TYPE.RELEASE_VIDEO]: 'releaseIds',
    [ANALYTICS_ENTITY_TYPE.WORKSPACE]: 'tenantIds',
    [ANALYTICS_ENTITY_TYPE.LABEL]: 'labelIds',
    [ANALYTICS_ENTITY_TYPE.DSP]: 'dspIds',
    [ANALYTICS_ENTITY_TYPE.ARTIST]: 'artistIds',
    [ANALYTICS_ENTITY_TYPE.CHANNEL]: 'channelIds',
    [ANALYTICS_ENTITY_TYPE.SOURCE_TYPE]: 'importSources',
};

export const getAnalyticsSelectionParams = (
    selectedIds?: AnalyticsSelectedIds
): AnalyticsSelectionParams => {
    if (!selectedIds) {
        return {};
    }

    return Object.entries(selectedIds).reduce<AnalyticsSelectionParams>(
        (params, [entityType, ids]) => {
            const key = selectionParamByEntityType[entityType];

            if (key && ids?.length) {
                (params as Record<string, string[]>)[key] = ids;
            }

            return params;
        },
        {}
    );
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
