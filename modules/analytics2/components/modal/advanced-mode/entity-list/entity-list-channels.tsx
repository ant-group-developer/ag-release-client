'use client';

import ImageFallback from '@/components/ui/image/image-fallback';
import { formattedNumber } from '@/helpers/common';
import { ANALYTICS_RANKING_THUMBNAIL_SIZE } from '@/modules/analytics2/constants/types';
import { ANALYTICS_ENTITY_TYPE, ANALYTICS_METRIC_KEY } from '@/modules/analytics2/enums';
import { useGetChannelRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopChannel } from '@/modules/analytics2/hooks/use-get-revenue-data';
import { Empty, List, Skeleton, Typography } from 'antd';
import dayjs from 'dayjs';
import { ContentItem } from '../content-entity-selector';

interface Props {
    fromDate?: string;
    toDate?: string;
    keyword?: string;
    activeMetric?: string;
    onSelect: (item: ContentItem) => void;
}

export default function EntityListChannels({
    fromDate = dayjs().subtract(27, 'day').format('YYYY-MM-DD'),
    toDate = dayjs().format('YYYY-MM-DD'),
    keyword,
    activeMetric,
    onSelect,
}: Props) {
    const isRevenue =
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_USAGE ||
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD;
    const sortBy =
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_USAGE
            ? 'usage'
            : activeMetric === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD
              ? 'revenue'
              : undefined;

    const { channelRankingData, isFetching: isRankingFetching } = useGetChannelRanking(
        { fromDate, toDate, page: 1, pageSize: 15, keyword },
        { enabled: !isRevenue }
    );
    const { topChannelData, isFetching: isRevenueFetching } = useGetRevenueTopChannel(
        { fromDate, toDate, page: 1, pageSize: 15, keyword: keyword || undefined, sortBy, includeOther: false },
        { enabled: isRevenue }
    );

    const isFetching = isRevenue ? isRevenueFetching : isRankingFetching;
    const hasData = isRevenue ? !!topChannelData?.items?.length : !!channelRankingData?.items?.length;
    if (isFetching && !hasData) return <Skeleton active paragraph={{ rows: 4 }} className="p-2" />;

    const items: any[] = isRevenue ? topChannelData?.items || [] : channelRankingData?.items || [];
    if (!items.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="my-4" />;

    return (
        <List
            dataSource={items}
            renderItem={(item) => (
                <List.Item
                    onClick={() =>
                        onSelect({
                            id: item.channelId,
                            title: item.channelName || '',
                            type: ANALYTICS_ENTITY_TYPE.CHANNEL,
                            thumbnailUrl: item.thumbUrl || undefined,
                            subtitle: `${formattedNumber(item.totalViews ?? (item as any).quantity ?? 0)} views`,
                        })
                    }
                    className="cursor-pointer rounded-lg py-2 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                    <div className="flex w-full items-center justify-between gap-3 px-2">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <ImageFallback src={item.thumbUrl} alt={item.channelName || ''} width={ANALYTICS_RANKING_THUMBNAIL_SIZE} height={ANALYTICS_RANKING_THUMBNAIL_SIZE} className="aspect-square shrink-0 rounded-full object-cover" />
                            <div className="flex flex-col overflow-hidden">
                                <Typography.Text ellipsis={{ tooltip: item.channelName }} className="text-sm font-medium">{item.channelName}</Typography.Text>
                                {item.tenant?.name && (
                                    <Typography.Text type="secondary" className="text-xs" ellipsis={{ tooltip: item.tenant.name }}>{item.tenant.name}</Typography.Text>
                                )}
                            </div>
                        </div>
                    </div>
                </List.Item>
            )}
        />
    );
}
