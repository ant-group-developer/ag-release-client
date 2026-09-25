'use client';

import { ANALYTIC_SORT_BY } from '@/enums/common';
import { useMemo, useState } from 'react';
import {
    ANALYTICS_ENTITY_TYPE,
    ANALYTICS_GRANULARITY,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_OVERVIEW_CHART_MODE,
    ANALYTICS_RELEASE_TYPE,
} from '../../../enums';
import {
    getCombinedAnalyticsScopeParams,
    getTrendViewDemographicsBarChartV2Params,
} from '../../../helpers';
import { useGetTrendViewDemographicsBarChartsV2 } from '../../../hooks/use-get-trend-view-demographics-bar-chart-v2';
import {
    ActiveAnalyticsEntity,
    AnalyticsCommonParams,
    AnalyticsFilterItem,
    AnalyticsSelectionParams,
} from '../../../types';
import {
    AnalyticsDemographicsContext,
    AnalyticsDemographicsContextValue,
} from '../../chart/analytics-overview-chart';
import RootAnalyticsOverviewChart from '../../chart/root-analytics-overview-chart';

export interface OverviewChartRendererProps {
    activeEntity: ActiveAnalyticsEntity;
    filters?: AnalyticsFilterItem[];
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    activeMetric: string;
    selectionParams?: AnalyticsSelectionParams;
    enabled?: boolean;
}

export default function OverviewChartRenderer({
    activeEntity,
    filters,
    fromDate,
    toDate,
    releaseType,
    activeMetric,
    selectionParams,
    enabled = true,
}: OverviewChartRendererProps) {
    const [overviewChartMode, setOverviewChartMode] =
        useState<ANALYTICS_OVERVIEW_CHART_MODE>(
            ANALYTICS_OVERVIEW_CHART_MODE.LINE
        );
    const [granularity, setGranularity] = useState<ANALYTICS_GRANULARITY>(
        ANALYTICS_GRANULARITY.DAY
    );

    const entityScope = useMemo(
        () => getCombinedAnalyticsScopeParams(activeEntity, filters),
        [activeEntity, filters]
    );

    const commonProps = {
        fromDate,
        toDate,
        releaseType,
        activeMetric,
        enabled,
        scopeParams: { ...entityScope, ...selectionParams },
        overviewChartMode,
        onOverviewChartModeChange: setOverviewChartMode,
        granularity,
        onGranularityChange: setGranularity,
    };

    const isViewsMetric = activeMetric === ANALYTICS_METRIC_KEY.TOTAL_VIEWS;

    const demographicsParams = useMemo<AnalyticsCommonParams>(() => {
        const params: AnalyticsCommonParams = {
            fromDate,
            toDate,
            sortBy: ANALYTIC_SORT_BY.VIEWS,
            releaseType:
                activeEntity.type === ANALYTICS_ENTITY_TYPE.RELEASE_VIDEO
                    ? ANALYTICS_RELEASE_TYPE.VIDEO
                    : releaseType,
            ...getCombinedAnalyticsScopeParams(activeEntity, filters),
            ...selectionParams,
        };

        return params;
    }, [activeEntity, filters, fromDate, releaseType, selectionParams, toDate]);

    const demographicsV2Params = useMemo(
        () => getTrendViewDemographicsBarChartV2Params(demographicsParams),
        [demographicsParams]
    );

    const { device, gender, age, isFetching } =
        useGetTrendViewDemographicsBarChartsV2(demographicsV2Params, {
            enabled: enabled && isViewsMetric && !!fromDate && !!toDate,
        });

    const demographicsValue =
        useMemo<AnalyticsDemographicsContextValue | null>(() => {
            if (!isViewsMetric) {
                return null;
            }

            return { device, gender, age, isFetching };
        }, [age, device, gender, isFetching, isViewsMetric]);
    const chart = (() => {
        if (!activeEntity.id) {
            return <RootAnalyticsOverviewChart {...commonProps} />;
        }

        switch (activeEntity.type) {
            // case ANALYTICS_ENTITY_TYPE.TRACK:
            //     return (
            //         <TrackAnalyticsOverviewChart
            //             isrc={activeEntity.id}
            //             {...commonProps}
            //         />
            //     );
            // case ANALYTICS_ENTITY_TYPE.RELEASE:
            //     return (
            //         <ReleaseAnalyticsOverviewChart
            //             releaseId={activeEntity.id}
            //             {...commonProps}
            //         />
            //     );
            // case ANALYTICS_ENTITY_TYPE.WORKSPACE:
            //     return (
            //         <TenantAnalyticsOverviewChart
            //             tenantId={activeEntity.id}
            //             {...commonProps}
            //         />
            //     );
            // case ANALYTICS_ENTITY_TYPE.LABEL:
            //     return (
            //         <LabelAnalyticsOverviewChart
            //             labelId={activeEntity.id}
            //             {...commonProps}
            //         />
            //     );
            // case ANALYTICS_ENTITY_TYPE.DSP:
            //     return (
            //         <DspAnalyticsOverviewChart
            //             pgDspId={activeEntity.id}
            //             dspReportId={activeEntity.entitySubId ?? ''}
            //             {...commonProps}
            //         />
            //     );
            // case ANALYTICS_ENTITY_TYPE.ARTIST:
            //     return (
            //         <ArtistAnalyticsOverviewChart
            //             artistId={activeEntity.id}
            //             {...commonProps}
            //         />
            //     );
            // case ANALYTICS_ENTITY_TYPE.CHANNEL:
            //     return (
            //         <ChannelAnalyticsOverviewChart
            //             channelId={activeEntity.id}
            //             {...commonProps}
            //         />
            //     );
            // case ANALYTICS_ENTITY_TYPE.SOURCE_TYPE:
            //     return (
            //         <SourceTypeAnalyticsOverviewChart
            //             sourceType={activeEntity.id}
            //             {...commonProps}
            //         />
            //     );
            // case ANALYTICS_ENTITY_TYPE.RELEASE_VIDEO:
            //     return (
            //         <ReleaseAnalyticsOverviewChart
            //             releaseId={activeEntity.id}
            //             {...commonProps}
            //             releaseType={ANALYTICS_RELEASE_TYPE.VIDEO}
            //         />
            //     );
            default:
                return <RootAnalyticsOverviewChart {...commonProps} />;
        }
    })();

    return (
        <AnalyticsDemographicsContext.Provider value={demographicsValue}>
            {chart}
        </AnalyticsDemographicsContext.Provider>
    );
}
