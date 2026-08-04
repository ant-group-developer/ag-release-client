'use client';

import { ANALYTICS_ENTITY_TYPE, ANALYTICS_RELEASE_TYPE } from '@/modules/analytics2/enums';
import { ActiveAnalyticsEntity } from '@/modules/analytics2/types';
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
    enabled?: boolean;
}

export default function DetailContentRenderer({
    activeEntity,
    fromDate,
    toDate,
    releaseType,
    enabled = true,
}: DetailContentRendererProps) {
    const commonTableProps = {
        fromDate,
        toDate,
        releaseType,
        enabled,
    };

    switch (activeEntity.type) {
        case ANALYTICS_ENTITY_TYPE.TRACK:
            return <TrackRankingTableCard {...commonTableProps} />;
        case ANALYTICS_ENTITY_TYPE.RELEASE:
            return <ReleaseRankingTableCard {...commonTableProps} />;
        case ANALYTICS_ENTITY_TYPE.WORKSPACE:
            return <TenantRankingTableCard {...commonTableProps} />;
        case ANALYTICS_ENTITY_TYPE.LABEL:
            return <LabelRankingTableCard {...commonTableProps} />;
        case ANALYTICS_ENTITY_TYPE.DSP:
            return <DspRankingTableCard {...commonTableProps} />;
        case ANALYTICS_ENTITY_TYPE.ARTIST:
            return <ArtistRankingTableCard {...commonTableProps} />;
    }
}
