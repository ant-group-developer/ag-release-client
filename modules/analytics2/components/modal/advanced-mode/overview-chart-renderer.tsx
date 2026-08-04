'use client';

import { ANALYTICS_ENTITY_TYPE, ANALYTICS_RELEASE_TYPE } from '../../../enums';
import { ActiveAnalyticsEntity } from '../../../types';
import ArtistAnalyticsOverviewChart from '../../chart/artist-analytics-overview-chart';
import DspAnalyticsOverviewChart from '../../chart/dsp-analytics-overview-chart';
import LabelAnalyticsOverviewChart from '../../chart/label-analytics-overview-chart';
import ReleaseAnalyticsOverviewChart from '../../chart/release-analytics-overview-chart';
import TenantAnalyticsOverviewChart from '../../chart/tenant-analytics-overview-chart';
import TrackAnalyticsOverviewChart from '../../chart/track-analytics-overview-chart';

export interface OverviewChartRendererProps {
    activeEntity: ActiveAnalyticsEntity;
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    activeMetric: string;
    enabled?: boolean;
}

export default function OverviewChartRenderer({
    activeEntity,
    fromDate,
    toDate,
    releaseType,
    activeMetric,
    enabled = true,
}: OverviewChartRendererProps) {
    const commonProps = {
        fromDate,
        toDate,
        releaseType,
        activeMetric,
        enabled,
    };

    switch (activeEntity.type) {
        case ANALYTICS_ENTITY_TYPE.TRACK:
            return (
                <TrackAnalyticsOverviewChart
                    isrc=""
                    {...commonProps}
                />
            );
        case ANALYTICS_ENTITY_TYPE.RELEASE:
            return (
                <ReleaseAnalyticsOverviewChart
                    releaseId=""
                    {...commonProps}
                />
            );
        case ANALYTICS_ENTITY_TYPE.WORKSPACE:
            return (
                <TenantAnalyticsOverviewChart
                    tenantId=""
                    {...commonProps}
                />
            );
        case ANALYTICS_ENTITY_TYPE.LABEL:
            return (
                <LabelAnalyticsOverviewChart
                    labelId=""
                    {...commonProps}
                />
            );
        case ANALYTICS_ENTITY_TYPE.DSP:
            return (
                <DspAnalyticsOverviewChart
                    pgDspId=""
                    dspReportId=""
                    {...commonProps}
                />
            );
        case ANALYTICS_ENTITY_TYPE.ARTIST:
            return (
                <ArtistAnalyticsOverviewChart
                    artistId=""
                    {...commonProps}
                />
            );
    }
}
