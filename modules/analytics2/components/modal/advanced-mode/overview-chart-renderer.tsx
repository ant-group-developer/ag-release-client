'use client';

import { ANALYTIC_SORT_BY } from '@/enums/common';
import { useMemo, useState } from 'react';
import {
    ANALYTICS_ENTITY_TYPE,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_OVERVIEW_CHART_MODE,
    ANALYTICS_RELEASE_TYPE,
} from '../../../enums';
import {
    getAnalyticsScopeParams,
    getCombinedAnalyticsScopeParams,
} from '../../../helpers';
import { useGetTrendViewDemographicsBarCharts } from '../../../hooks/use-get-trend-view-demographics-bar-chart';
import {
    ActiveAnalyticsEntity,
    AnalyticsCommonParams,
    AnalyticsFilterItem,
} from '../../../types';
import {
    AnalyticsDemographicsContext,
    AnalyticsDemographicsContextValue,
} from '../../chart/analytics-overview-chart';
import ArtistAnalyticsOverviewChart from '../../chart/artist-analytics-overview-chart';
import ChannelAnalyticsOverviewChart from '../../chart/channel-analytics-overview-chart';
import DspAnalyticsOverviewChart from '../../chart/dsp-analytics-overview-chart';
import LabelAnalyticsOverviewChart from '../../chart/label-analytics-overview-chart';
import ReleaseAnalyticsOverviewChart from '../../chart/release-analytics-overview-chart';
import RootAnalyticsOverviewChart from '../../chart/root-analytics-overview-chart';
import SourceTypeAnalyticsOverviewChart from '../../chart/source-type-analytics-overview-chart';
import TenantAnalyticsOverviewChart from '../../chart/tenant-analytics-overview-chart';
import TrackAnalyticsOverviewChart from '../../chart/track-analytics-overview-chart';

export interface OverviewChartRendererProps {
    activeEntity: ActiveAnalyticsEntity;
    filters?: AnalyticsFilterItem[];
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    activeMetric: string;
    enabled?: boolean;
}

export default function OverviewChartRenderer({
    activeEntity,
    filters,
    fromDate,
    toDate,
    releaseType,
    activeMetric,
    enabled = true,
}: OverviewChartRendererProps) {
    const [overviewChartMode, setOverviewChartMode] =
        useState<ANALYTICS_OVERVIEW_CHART_MODE>(
            ANALYTICS_OVERVIEW_CHART_MODE.LINE
        );

    const commonProps = {
        fromDate,
        toDate,
        releaseType,
        activeMetric,
        enabled,
        overviewChartMode,
        onOverviewChartModeChange: setOverviewChartMode,
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
        };

        return params;
    }, [activeEntity, filters, fromDate, releaseType, toDate]);

    const { device, gender, age, isFetching } =
        useGetTrendViewDemographicsBarCharts(demographicsParams, {
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
            case ANALYTICS_ENTITY_TYPE.TRACK:
                return (
                    <TrackAnalyticsOverviewChart
                        isrc={activeEntity.id}
                        {...commonProps}
                    />
                );
            case ANALYTICS_ENTITY_TYPE.RELEASE:
                return (
                    <ReleaseAnalyticsOverviewChart
                        releaseId={activeEntity.id}
                        {...commonProps}
                    />
                );
            case ANALYTICS_ENTITY_TYPE.WORKSPACE:
                return (
                    <TenantAnalyticsOverviewChart
                        tenantId={activeEntity.id}
                        {...commonProps}
                    />
                );
            case ANALYTICS_ENTITY_TYPE.LABEL:
                return (
                    <LabelAnalyticsOverviewChart
                        labelId={activeEntity.id}
                        {...commonProps}
                    />
                );
            case ANALYTICS_ENTITY_TYPE.DSP:
                return (
                    <DspAnalyticsOverviewChart
                        pgDspId={activeEntity.id}
                        dspReportId={activeEntity.entitySubId ?? ''}
                        {...commonProps}
                    />
                );
            case ANALYTICS_ENTITY_TYPE.ARTIST:
                return (
                    <ArtistAnalyticsOverviewChart
                        artistId={activeEntity.id}
                        {...commonProps}
                    />
                );
            case ANALYTICS_ENTITY_TYPE.CHANNEL:
                return (
                    <ChannelAnalyticsOverviewChart
                        channelId={activeEntity.id}
                        {...commonProps}
                    />
                );
            case ANALYTICS_ENTITY_TYPE.SOURCE_TYPE:
                return (
                    <SourceTypeAnalyticsOverviewChart
                        sourceType={activeEntity.id}
                        {...commonProps}
                    />
                );
            // A release-video is a release, so it reuses the release chart; only
            // the release type is pinned.
            case ANALYTICS_ENTITY_TYPE.RELEASE_VIDEO:
                return (
                    <ReleaseAnalyticsOverviewChart
                        releaseId={activeEntity.id}
                        {...commonProps}
                        releaseType={ANALYTICS_RELEASE_TYPE.VIDEO}
                    />
                );
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
