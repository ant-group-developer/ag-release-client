'use client';

import ImageFallback from '@/components/ui/image/image-fallback';
import AppSearch from '@/components/ui/input/search';
import DateSelect2 from '@/components/ui/select/date-select2';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { APP_ROUTES } from '@/enums/routes';
import { useFilter } from '@/hooks/use-filter';
import { ANALYTICS_RANKING_THUMBNAIL_SIZE } from '@/modules/analytics2/constants/types';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import { useGetTenantRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopTenant } from '@/modules/analytics2/hooks/use-get-revenue-data';
import {
    RevenueTenantItem,
    TenantRankingItem,
} from '@/modules/analytics2/types';
import { CommonParams } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Table, theme } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

const DEFAULT_PAGE = 1;

interface RankingFilter extends CommonParams {
    startDate?: string;
    endDate?: string;
    type?: ANALYTICS_VIEW_TYPE;
}

export default function TenantsRankingPage() {
    const { token } = theme.useToken();
    const messages = useTranslations();

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<RankingFilter>({
            page: DEFAULT_PAGE,
            pageSize: PAGE_SIZE_DEFAULT,
            startDate: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
            endDate: dayjs().format('YYYY-MM-DD'),
            type: ANALYTICS_VIEW_TYPE.VIEW,
        });

    const page = dataFilter.page ?? DEFAULT_PAGE;
    const pageSize = dataFilter.pageSize ?? PAGE_SIZE_DEFAULT;
    const isRevenue = dataFilter.type === ANALYTICS_VIEW_TYPE.REVENUE;

    // Fetch ranking data (Views)
    const { tenantRankingData, isFetching: isViewsFetching } =
        useGetTenantRanking(
            {
                fromDate: dataFilter.startDate!,
                toDate: dataFilter.endDate!,
                page,
                pageSize,
                keyword: dataFilter.keyword ?? undefined,
            },
            { enabled: !isRevenue }
        );

    // Fetch revenue ranking data
    const { topTenantData, isFetching: isRevenueFetching } =
        useGetRevenueTopTenant(
            {
                fromDate: dataFilter.startDate!,
                toDate: dataFilter.endDate!,
                page,
                pageSize,
                keyword: dataFilter.keyword ?? undefined,
                includeOther: false,
            },
            { enabled: isRevenue }
        );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const revenueColumns: ColumnsType<RevenueTenantItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 80,
            align: 'center' as const,
            render: (rank: number) => (
                <span className="text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('tenant.name'),
            dataIndex: 'tenantName',
            key: 'tenantName',
            ellipsis: true,
            render: (text: string, record: RevenueTenantItem) => (
                <div className="flex items-center gap-3">
                    <ImageFallback
                        src={record.logo ?? ''}
                        alt={text}
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        className="aspect-square rounded-full object-cover"
                    />
                    <span className="text-gray-900 dark:text-zinc-100">
                        {text || '—'}
                    </span>
                </div>
            ),
        },
        {
            title: messages('common.usage'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: 150,
            render: (qty: number) => (
                <span className="text-gray-600 dark:text-zinc-400">
                    {qty ? qty.toLocaleString() : 0}
                </span>
            ),
        },
        {
            title: messages('common.revenue'),
            dataIndex: 'revenueUsd',
            key: 'revenueUsd',
            width: 180,
            render: (val: number) => (
                <span className="text-gray-900 dark:text-zinc-100">
                    $
                    {val
                        ? val.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                          })
                        : '0.00'}
                </span>
            ),
        },
    ];

    const viewColumns: ColumnsType<TenantRankingItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 80,
            align: 'center' as const,
            render: (rank: number) => (
                <span className="text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('tenant.name'),
            dataIndex: 'tenantName',
            key: 'tenantName',
            ellipsis: true,
            render: (text: string, record: TenantRankingItem) => (
                <div className="flex items-center gap-3">
                    <ImageFallback
                        src={record.logo ?? ''}
                        alt={text}
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        className="aspect-square rounded-full object-cover"
                    />
                    <span className="text-gray-900 dark:text-zinc-100">
                        {text || '—'}
                    </span>
                </div>
            ),
        },
        {
            title: messages('common.viewCount'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 180,
            render: (views: number) => (
                <span className="text-gray-900 dark:text-zinc-100">
                    {views ? views.toLocaleString() : 0}
                </span>
            ),
        },
    ];

    const pageTitle = isRevenue
        ? `${messages('tenant.workspaces')} - ${messages('common.revenue')}`
        : `${messages('tenant.workspaces')} - ${messages('common.views')}`;

    const breadcrumbs = [
        {
            title: messages('analytics.label'),
            href: APP_ROUTES.ANALYTICS2,
        },
        {
            title: pageTitle,
        },
    ];

    return (
        <div
            className="h-full min-h-[calc(100vh-64px)] overflow-auto"
            style={{ backgroundColor: token.colorBgLayout }}
        >
            <PageContainer
                title={pageTitle}
                header={{
                    breadcrumb: {
                        items: breadcrumbs,
                    },
                }}
                extra={
                    <DateSelect2
                        style={{ width: 240 }}
                        value={`${dataFilter.startDate},${dataFilter.endDate}`}
                        onChange={(value) => {
                            const [start, end] = value.toString().split(',');
                            onChangeFilter({
                                startDate: start,
                                endDate: end,
                            });
                        }}
                    />
                }
            >
                <Card className="rounded-xl border-none shadow-sm">
                    <div style={{ marginBottom: 16 }}>
                        <AppSearch
                            onChange={onSearch}
                            defaultValue={dataFilter.keyword}
                            style={{ width: 200 }}
                        />
                    </div>
                    {isRevenue ? (
                        <Table<RevenueTenantItem>
                            sticky
                            size="small"
                            columns={revenueColumns}
                            dataSource={topTenantData.items}
                            loading={isFetching}
                            rowKey="tenantId"
                            pagination={{
                                current: dataFilter.page,
                                pageSize: dataFilter.pageSize,
                                total: topTenantData?.metadata?.totalItems,
                                pageSizeOptions: PAGE_SIZE_OPTIONS,
                                showSizeChanger: true,
                                showTotal: (totalCount, range) =>
                                    `${range[0]}-${range[1]} / ${totalCount}`,
                                onChange: onChangePage,
                            }}
                        />
                    ) : (
                        <Table<TenantRankingItem>
                            sticky
                            size="small"
                            columns={viewColumns}
                            dataSource={tenantRankingData.items}
                            loading={isFetching}
                            rowKey="tenantId"
                            pagination={{
                                current: dataFilter.page,
                                pageSize: dataFilter.pageSize,
                                total: tenantRankingData?.metadata?.totalItems,
                                pageSizeOptions: PAGE_SIZE_OPTIONS,
                                showSizeChanger: true,
                                showTotal: (totalCount, range) =>
                                    `${range[0]}-${range[1]} / ${totalCount}`,
                                onChange: onChangePage,
                            }}
                        />
                    )}
                </Card>
            </PageContainer>
        </div>
    );
}
