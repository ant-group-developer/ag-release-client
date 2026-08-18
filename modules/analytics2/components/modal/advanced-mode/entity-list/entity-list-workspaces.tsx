'use client';

import { ANALYTICS_METRIC_KEY } from '@/modules/analytics2/enums';
import { useGetTenantRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopTenant } from '@/modules/analytics2/hooks/use-get-revenue-data';
import { TenantRankingItem } from '@/modules/analytics2/types';
import TenantTag from '@/modules/tenant/components/tenant-tag';
import { Avatar, Empty, List, Skeleton, Typography } from 'antd';
import dayjs from 'dayjs';
import { ContentItem } from '../content-entity-selector';

interface Props {
    fromDate?: string;
    toDate?: string;
    keyword?: string;
    activeMetric?: string;
    onSelect: (item: ContentItem) => void;
}

export default function EntityListWorkspaces({
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

    const { tenantRankingData, isFetching: isRankingFetching } = useGetTenantRanking(
        { fromDate, toDate, page: 1, pageSize: 15, keyword },
        { enabled: !isRevenue }
    );
    const { topTenantData, isFetching: isRevenueFetching } = useGetRevenueTopTenant(
        { fromDate, toDate, page: 1, pageSize: 15, keyword: keyword || undefined, sortBy, includeOther: false },
        { enabled: isRevenue }
    );

    const isFetching = isRevenue ? isRevenueFetching : isRankingFetching;
    const hasData = isRevenue ? !!topTenantData?.items?.length : !!tenantRankingData?.items?.length;
    if (isFetching && !hasData) return <Skeleton active paragraph={{ rows: 4 }} className="p-2" />;

    const items: any[] = isRevenue ? topTenantData?.items || [] : tenantRankingData?.items || [];
    if (!items.length) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="my-4" />;

    return (
        <List
            dataSource={items}
            renderItem={(item: TenantRankingItem | any) => (
                <List.Item
                    onClick={() =>
                        onSelect({
                            id: item.tenantId,
                            title: item.tenantName,
                            type: 'Workspace',
                            thumbnailUrl: item.logo || '',
                        })
                    }
                    className="cursor-pointer rounded-lg py-2 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                    <div className="flex w-full items-center justify-between gap-3 px-2">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <Avatar shape="square" size={40} src={item.logo} className="shrink-0 rounded-md">
                                {(item.tenantName || 'W')[0]?.toUpperCase()}
                            </Avatar>
                            <div className="flex flex-col overflow-hidden">
                                <Typography.Text ellipsis={{ tooltip: item.tenantName }} className="text-sm font-medium">
                                    {item.tenantName}
                                </Typography.Text>
                                <div className="mt-0.5">
                                    <TenantTag type={item.type} />
                                </div>
                            </div>
                        </div>
                    </div>
                </List.Item>
            )}
        />
    );
}
