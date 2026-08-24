'use client';

import { formattedNumber } from '@/helpers/common';
import { ANALYTICS_RANKING_THUMBNAIL_SIZE } from '@/modules/analytics2/constants/types';
import { ANALYTICS_METRIC_KEY } from '@/modules/analytics2/enums';
import { useGetLabelRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopLabel } from '@/modules/analytics2/hooks/use-get-revenue-data';
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

export default function EntityListLabels({
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

    const { labelRankingData, isFetching: isRankingFetching } = useGetLabelRanking(
        { fromDate, toDate, page: 1, pageSize: 15, keyword },
        { enabled: !isRevenue }
    );
    const { topLabelData, isFetching: isRevenueFetching } = useGetRevenueTopLabel(
        { fromDate, toDate, page: 1, pageSize: 15, keyword: keyword || undefined, sortBy, includeOther: false },
        { enabled: isRevenue }
    );

    const isFetching = isRevenue ? isRevenueFetching : isRankingFetching;
    const hasData = isRevenue ? !!topLabelData?.items?.length : !!labelRankingData?.items?.length;
    if (isFetching && !hasData) return <Skeleton active paragraph={{ rows: 4 }} className="p-2" />;

    const items: any[] = isRevenue ? topLabelData?.items || [] : labelRankingData?.items || [];
    if (!items.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="my-4" />;

    return (
        <List
            dataSource={items}
            renderItem={(item) => {
                const labelLogo = item.picture || item.image || (item as any).logo || (item as any).imageUrl;
                return (
                    <List.Item
                        onClick={() =>
                            onSelect({
                                id: item.labelId,
                                title: item.labelName,
                                type: 'Label',
                                thumbnailUrl: labelLogo || undefined,
                                subtitle: `${formattedNumber(item.totalViews ?? item.quantity ?? 0)} views`,
                            })
                        }
                        className="cursor-pointer rounded-lg py-2 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                    >
                        <div className="flex w-full items-center justify-between gap-3 px-2">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <ReleaseCoverImage width={ANALYTICS_RANKING_THUMBNAIL_SIZE} height={ANALYTICS_RANKING_THUMBNAIL_SIZE} src={labelLogo} />
                                <div className="flex flex-col overflow-hidden">
                                    <Typography.Text ellipsis={{ tooltip: item.labelName }} className="text-sm font-medium">{item.labelName}</Typography.Text>
                                    <Typography.Text type="secondary" className="text-xs">Label</Typography.Text>
                                </div>
                            </div>
                        </div>
                    </List.Item>
                );
            }}
        />
    );
}
