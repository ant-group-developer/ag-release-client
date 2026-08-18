'use client';

import { formattedNumber } from '@/helpers/common';
import { ANALYTICS_RANKING_THUMBNAIL_SIZE } from '@/modules/analytics2/constants/types';
import { ANALYTICS_ENTITY_TYPE, ANALYTICS_METRIC_KEY } from '@/modules/analytics2/enums';
import { useGetSourceTypeRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopSourceType } from '@/modules/analytics2/hooks/use-get-revenue-data';
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

export default function EntityListSourceTypes({
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

    const { sourceTypeRankingData, isFetching: isRankingFetching } = useGetSourceTypeRanking(
        { fromDate, toDate, page: 1, pageSize: 15, keyword } as any,
        { enabled: !isRevenue }
    );
    const { topSourceTypeData, isFetching: isRevenueFetching } = useGetRevenueTopSourceType(
        { fromDate, toDate, page: 1, pageSize: 15, keyword: keyword || undefined, sortBy, includeOther: false } as any,
        { enabled: isRevenue }
    );

    const isFetching = isRevenue ? isRevenueFetching : isRankingFetching;
    const hasData = isRevenue
        ? !!topSourceTypeData?.items?.length
        : !!sourceTypeRankingData?.items?.length;
    if (isFetching && !hasData) return <Skeleton active paragraph={{ rows: 4 }} className="p-2" />;

    const items: any[] = isRevenue ? topSourceTypeData?.items || [] : sourceTypeRankingData?.items || [];
    if (!items.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="my-4" />;

    return (
        <List
            dataSource={items}
            renderItem={(item) => {
                const val = (item as any).totalViews ?? (item as any).quantity ?? 0;
                const title = (item as any).sourceTypeLabel || item.sourceType;
                return (
                    <List.Item
                        onClick={() =>
                            onSelect({
                                id: item.sourceType,
                                title,
                                type: ANALYTICS_ENTITY_TYPE.SOURCE_TYPE,
                                thumbnailUrl: item.imageUrl || undefined,
                                subtitle: `${formattedNumber(val)} views`,
                            })
                        }
                        className="cursor-pointer rounded-lg py-2 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                    >
                        <div className="flex w-full items-center justify-between gap-3 px-2">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <ReleaseCoverImage width={ANALYTICS_RANKING_THUMBNAIL_SIZE} height={ANALYTICS_RANKING_THUMBNAIL_SIZE} src={item.imageUrl} />
                                <div className="flex flex-col overflow-hidden">
                                    <Typography.Text ellipsis={{ tooltip: title }} className="text-sm font-medium">{title}</Typography.Text>
                                </div>
                            </div>
                        </div>
                    </List.Item>
                );
            }}
        />
    );
}
