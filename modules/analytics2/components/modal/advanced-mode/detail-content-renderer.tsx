'use client';

import {
    ANALYTICS_ENTITY_TYPE,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_RELEASE_TYPE,
} from '@/modules/analytics2/enums';
import { ActiveAnalyticsEntity } from '@/modules/analytics2/types';
import { ContentItem } from './content-entity-selector';
import ArtistRankingTableCard from '../../ranking/artist-ranking-table-card';
import DspRankingTableCard from '../../ranking/dsp-ranking-table-card';
import LabelRankingTableCard from '../../ranking/label-ranking-table-card';
import ReleaseRankingTableCard from '../../ranking/release-ranking-table-card';
import TenantRankingTableCard from '../../ranking/tenant-ranking-table-card';
import TrackRankingTableCard from '../../ranking/track-ranking-table-card';

export interface DetailContentRendererProps {
    activeEntity: ActiveAnalyticsEntity;
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    activeMetric: ANALYTICS_METRIC_KEY;
    onMetricChange: (metricKey: ANALYTICS_METRIC_KEY) => void;
    onSelectEntity?: (item?: ContentItem) => void;
    enabled?: boolean;
}

export default function DetailContentRenderer({
    activeEntity,
    fromDate,
    toDate,
    releaseType,
    activeMetric,
    onMetricChange,
    onSelectEntity,
    enabled = true,
}: DetailContentRendererProps) {
    const commonTableProps = {
        fromDate,
        toDate,
        releaseType,
        metricKey: activeMetric,
        onMetricChange,
        onSelectEntity,
        enabled,
    };

    switch (activeEntity.type) {
        case ANALYTICS_ENTITY_TYPE.TRACK:
            return (
                <TrackRankingTableCard
                    trackId={activeEntity.id}
                    isrc={activeEntity.id}
                    {...commonTableProps}
                />
            );
        case ANALYTICS_ENTITY_TYPE.RELEASE:
            return (
                <ReleaseRankingTableCard
                    releaseId={activeEntity.id}
                    {...commonTableProps}
                />
            );
        case ANALYTICS_ENTITY_TYPE.WORKSPACE:
            return (
                <TenantRankingTableCard
                    tenantId={activeEntity.id}
                    {...commonTableProps}
                />
            );
        case ANALYTICS_ENTITY_TYPE.LABEL:
            return (
                <LabelRankingTableCard
                    labelId={activeEntity.id}
                    {...commonTableProps}
                />
            );
        case ANALYTICS_ENTITY_TYPE.DSP:
            return (
                <DspRankingTableCard
                    pgDspId={activeEntity.id}
                    dspReportId={activeEntity.entitySubId || activeEntity.id}
                    {...commonTableProps}
                />
            );
        case ANALYTICS_ENTITY_TYPE.ARTIST:
            return (
                <ArtistRankingTableCard
                    artistId={activeEntity.id}
                    {...commonTableProps}
                />
            );
    }
}
