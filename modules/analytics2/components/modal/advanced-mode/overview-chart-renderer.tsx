'use client';

import { ANALYTICS_RELEASE_TYPE } from '../../../enums';
import ArtistAnalyticsOverviewChart from '../../chart/artist-analytics-overview-chart';
import DspAnalyticsOverviewChart from '../../chart/dsp-analytics-overview-chart';
import LabelAnalyticsOverviewChart from '../../chart/label-analytics-overview-chart';
import ReleaseAnalyticsOverviewChart from '../../chart/release-analytics-overview-chart';
import TenantAnalyticsOverviewChart from '../../chart/tenant-analytics-overview-chart';
import TrackAnalyticsOverviewChart from '../../chart/track-analytics-overview-chart';

export interface ActiveEntity {
    type: 'Track' | 'Release' | 'Workspace' | 'Label' | 'DSP' | 'Artist' | 'All';
    id: string;
}

export interface OverviewChartRendererProps {
    activeEntity: ActiveEntity;
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
        case 'Track':
            return (
                <TrackAnalyticsOverviewChart
                    isrc={activeEntity.id}
                    {...commonProps}
                />
            );
        case 'Release':
            return (
                <ReleaseAnalyticsOverviewChart
                    releaseId={activeEntity.id}
                    {...commonProps}
                />
            );
        case 'Workspace':
            return (
                <TenantAnalyticsOverviewChart
                    tenantId={activeEntity.id}
                    {...commonProps}
                />
            );
        case 'Label':
            return (
                <LabelAnalyticsOverviewChart
                    labelId={activeEntity.id}
                    {...commonProps}
                />
            );
        case 'DSP':
            return (
                <DspAnalyticsOverviewChart
                    pgDspId={activeEntity.id}
                    dspReportId={activeEntity.id}
                    {...commonProps}
                />
            );
        case 'Artist':
            return (
                <ArtistAnalyticsOverviewChart
                    artistId={activeEntity.id}
                    {...commonProps}
                />
            );
        default:
            return (
                <ReleaseAnalyticsOverviewChart
                    releaseId=""
                    {...commonProps}
                />
            );
    }
}
