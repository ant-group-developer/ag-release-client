import { Badge, Button, Empty, Space, Spin, Timeline, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { isMilestoneLevel } from '../../helpers';
import { useDistributionStream } from '../../hooks/use-distribution-stream';
import { useGetTimeline } from '../../hooks/use-get-timeline';
import { TimelineEvent } from '../../types';
import DistributionTimelineItem from '../timeline-item';

interface Props {
    distributionId?: string;
    /** Bật SSE realtime (mặc định bật). */
    live?: boolean;
    limit?: number;
}

/**
 * Timeline viewer: history (cursor pagination) + live events (SSE) hợp nhất.
 * Dedupe theo event.id, sort tăng theo occurredAt.
 */
export default function DistributionTimeline({
    distributionId,
    live = true,
    limit,
}: Props) {
    const messages = useTranslations();

    const {
        timelineEvents,
        isFetching,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useGetTimeline(distributionId, { limit });

    const { events: liveEvents, isListening } = useDistributionStream({
        distributionId,
        enabled: live && !!distributionId,
    });

    const merged = useMemo(() => {
        const map = new Map<string, TimelineEvent>();
        [...timelineEvents, ...liveEvents].forEach((e) => map.set(e.id, e));
        return Array.from(map.values()).sort(
            (a, b) =>
                new Date(a.occurredAt).getTime() -
                new Date(b.occurredAt).getTime()
        );
    }, [timelineEvents, liveEvents]);

    if (!distributionId) {
        return <Empty description={messages('common.noDataAvailable')} />;
    }

    return (
        <div className="flex flex-col gap-3">
            <Space className="justify-between">
                <Typography.Text strong>
                    {messages('distributionOrchestration.timeline.title')}
                </Typography.Text>
                {live && (
                    <Badge
                        status={isListening ? 'processing' : 'default'}
                        text={messages(
                            isListening
                                ? 'distributionOrchestration.timeline.live'
                                : 'distributionOrchestration.timeline.offline'
                        )}
                    />
                )}
            </Space>

            {isFetching && merged.length === 0 ? (
                <div className="flex justify-center py-6">
                    <Spin />
                </div>
            ) : merged.length === 0 ? (
                <Empty description={messages('common.noDataAvailable')} />
            ) : (
                <Timeline
                    items={merged.map((event) => ({
                        color: isMilestoneLevel(event.level) ? 'blue' : 'gray',
                        children: <DistributionTimelineItem event={event} />,
                    }))}
                />
            )}

            {hasNextPage && (
                <Button
                    onClick={() => fetchNextPage()}
                    loading={isFetchingNextPage}
                    block
                >
                    {messages('distributionOrchestration.timeline.loadMore')}
                </Button>
            )}
        </div>
    );
}
