'use client';

import { formattedNumber } from '@/helpers/common';
import { ANALYTICS_RANKING_THUMBNAIL_SIZE } from '@/modules/analytics2/constants/types';
import { ANALYTICS_METRIC_KEY } from '@/modules/analytics2/enums';
import { useGetArtistRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopArtist } from '@/modules/analytics2/hooks/use-get-revenue-data';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
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

export default function EntityListArtists({
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

    const { artistRankingData, isFetching: isRankingFetching } = useGetArtistRanking(
        { fromDate, toDate, page: 1, pageSize: 15, keyword },
        { enabled: !isRevenue }
    );
    const { topArtistData, isFetching: isRevenueFetching } = useGetRevenueTopArtist(
        { fromDate, toDate, page: 1, pageSize: 15, keyword: keyword || undefined, sortBy, includeOther: false },
        { enabled: isRevenue }
    );

    const isFetching = isRevenue ? isRevenueFetching : isRankingFetching;
    const hasData = isRevenue ? !!topArtistData?.items?.length : !!artistRankingData?.items?.length;
    if (isFetching && !hasData) return <Skeleton active paragraph={{ rows: 4 }} className="p-2" />;

    const items: any[] = isRevenue ? topArtistData?.items || [] : artistRankingData?.items || [];
    if (!items.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="my-4" />;

    return (
        <List
            dataSource={items}
            renderItem={(item) => {
                const artistImage = item.picture || (item as any).image || (item as any).avatar || (item as any).imageUrl;
                return (
                    <List.Item
                        onClick={() =>
                            onSelect({
                                id: item.artistId,
                                title: item.artistName,
                                type: 'Artist',
                                thumbnailUrl: artistImage || undefined,
                                subtitle: `${formattedNumber(item.totalViews ?? item.quantity ?? 0)} views`,
                            })
                        }
                        className="cursor-pointer rounded-lg py-2 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                    >
                        <div className="flex w-full items-center justify-between gap-3 px-2">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <ReleaseCoverImage width={ANALYTICS_RANKING_THUMBNAIL_SIZE} height={ANALYTICS_RANKING_THUMBNAIL_SIZE} src={artistImage} />
                                <div className="flex flex-col overflow-hidden">
                                    <Typography.Text ellipsis={{ tooltip: item.artistName }} className="text-sm font-medium">{item.artistName}</Typography.Text>
                                    <Typography.Text type="secondary" className="text-xs">Artist</Typography.Text>
                                </div>
                            </div>
                        </div>
                    </List.Item>
                );
            }}
        />
    );
}
