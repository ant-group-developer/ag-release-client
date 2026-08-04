'use client';

import { ANALYTICS_ENTITY_TYPE, ANALYTICS_RELEASE_TYPE } from '../../../enums';
import { ActiveAnalyticsEntity } from '../../../types';
import ArtistAnalyticsOverviewChart from '../../chart/artist-analytics-overview-chart';
import DspAnalyticsOverviewChart from '../../chart/dsp-analytics-overview-chart';
import LabelAnalyticsOverviewChart from '../../chart/label-analytics-overview-chart';
import ReleaseAnalyticsOverviewChart from '../../chart/release-analytics-overview-chart';
import RootAnalyticsOverviewChart from '../../chart/root-analytics-overview-chart';
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
        default:
            return <RootAnalyticsOverviewChart {...commonProps} />;
    }
}
