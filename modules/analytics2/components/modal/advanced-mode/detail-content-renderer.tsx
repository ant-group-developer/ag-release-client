'use client';

import {
    ANALYTICS_ENTITY_TYPE,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_RELEASE_TYPE,
} from '@/modules/analytics2/enums';
import {
    getAnalyticsScopeParams,
    getCombinedAnalyticsScopeParams,
    type AnalyticsScopeParams,
} from '@/modules/analytics2/helpers';
import {
    ActiveAnalyticsEntity,
    AnalyticsEntityType,
    AnalyticsFilterItem,
} from '@/modules/analytics2/types';
import ArtistRankingTableCard from '../../ranking/artist-ranking-table-card';
import ChannelRankingTableCard from '../../ranking/channel-ranking-table-card';
import DspRankingTableCard from '../../ranking/dsp-ranking-table-card';
import LabelRankingTableCard from '../../ranking/label-ranking-table-card';
import ReleaseRankingTableCard from '../../ranking/release-ranking-table-card';
import ReleaseVideoRankingTableCard from '../../ranking/release-video-ranking-table-card';
import SourceTypeRankingTableCard from '../../ranking/source-type-ranking-table-card';
import TenantRankingTableCard from '../../ranking/tenant-ranking-table-card';
import TrackRankingTableCard from '../../ranking/track-ranking-table-card';
import { ContentItem } from './content-entity-selector';

export interface DetailContentRendererProps {
    activeEntity: ActiveAnalyticsEntity;
    filters?: AnalyticsFilterItem[];
    rankBy?: AnalyticsEntityType;
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    activeMetric: ANALYTICS_METRIC_KEY;
    onMetricChange: (metricKey: ANALYTICS_METRIC_KEY) => void;
    onSelectEntity?: (item?: ContentItem) => void;
    enabled?: boolean;
    paramPrefix?: string;
}

interface RankingTableProps {
    type: AnalyticsEntityType;
    scopeParams: AnalyticsScopeParams;
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    metricKey: ANALYTICS_METRIC_KEY;
    onMetricChange: (metricKey: ANALYTICS_METRIC_KEY) => void;
    onSelectEntity?: (item?: ContentItem) => void;
    enabled: boolean;
    paramPrefix?: string;
}

function RankingTable({ type, ...rest }: RankingTableProps) {
    switch (type) {
        case ANALYTICS_ENTITY_TYPE.TRACK:
            return <TrackRankingTableCard {...rest} />;
        case ANALYTICS_ENTITY_TYPE.RELEASE:
            return <ReleaseRankingTableCard {...rest} />;
        case ANALYTICS_ENTITY_TYPE.WORKSPACE:
            return <TenantRankingTableCard {...rest} />;
        case ANALYTICS_ENTITY_TYPE.LABEL:
            return <LabelRankingTableCard {...rest} />;
        case ANALYTICS_ENTITY_TYPE.DSP:
            return <DspRankingTableCard {...rest} />;
        case ANALYTICS_ENTITY_TYPE.ARTIST:
            return <ArtistRankingTableCard {...rest} />;
        case ANALYTICS_ENTITY_TYPE.CHANNEL:
            return <ChannelRankingTableCard {...rest} />;
        case ANALYTICS_ENTITY_TYPE.SOURCE_TYPE:
            return <SourceTypeRankingTableCard {...rest} />;
        case ANALYTICS_ENTITY_TYPE.RELEASE_VIDEO:
            return (
                <ReleaseVideoRankingTableCard
                    scopeParams={rest.scopeParams}
                    fromDate={rest.fromDate}
                    toDate={rest.toDate}
                    metricKey={rest.metricKey}
                    onMetricChange={rest.onMetricChange}
                    onSelectEntity={rest.onSelectEntity}
                    enabled={rest.enabled}
                    paramPrefix={rest.paramPrefix}
                />
            );
        default:
            return null;
    }
}

export default function DetailContentRenderer({
    activeEntity,
    filters,
    rankBy,
    fromDate,
    toDate,
    releaseType,
    activeMetric,
    onMetricChange,
    onSelectEntity,
    enabled = true,
    paramPrefix,
}: DetailContentRendererProps) {
    const scopeParams = getCombinedAnalyticsScopeParams(activeEntity, filters);

    const commonTableProps = {
        scopeParams,
        fromDate,
        toDate,
        releaseType,
        metricKey: activeMetric,
        onMetricChange,
        onSelectEntity,
        enabled,
    };

    const tableType =
        rankBy && activeEntity.id && rankBy !== activeEntity.type
            ? rankBy
            : activeEntity.type;

    return (
        <div className="flex flex-col gap-4">
            <RankingTable
                type={tableType}
                paramPrefix={paramPrefix}
                {...commonTableProps}
            />
        </div>
    );
}
