'use client';

import ImageFallback from '@/components/ui/image/image-fallback';
import AppPagination from '@/components/ui/pagination';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { SCREEN } from '@/enums/common';
import { formattedNumber } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import DetailSourceTypeAnalyticsModal from '@/modules/analytics2/components/detail-source-type/detail-source-type-analytics-modal';
import DetailTenantAnalyticsModal from '@/modules/analytics2/components/detail-tenant/detail-tenant-analytics-modal';
import { ContentItem } from '@/modules/analytics2/components/modal/advanced-mode/content-entity-selector';
import {
    ANALYTICS_DEFAULT_END_DATE,
    ANALYTICS_DEFAULT_START_DATE,
    ANALYTICS_RANKING_THUMBNAIL_SIZE,
} from '@/modules/analytics2/constants/types';
import {
    ANALYTICS_ENTITY_TYPE,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_RELEASE_TYPE,
} from '@/modules/analytics2/enums';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import {
    getAnalyticsReleaseType,
    getAnalyticsViewType,
    type AnalyticsScopeParams,
} from '@/modules/analytics2/helpers';
import { useGetTenantRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopTenant } from '@/modules/analytics2/hooks/use-get-revenue-data';
import {
    BySourceItem,
    RevenueTenantItem,
    TenantRankingItem,
} from '@/modules/analytics2/types';
import TenantTag from '@/modules/tenant/components/tenant-tag';
import { TENANT_TYPE } from '@/modules/tenant/enums';
import { CommonParams } from '@/types/api';
import { Card, Grid, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import RankingTableFilter from './ranking-table-filter';

const DEFAULT_PAGE = 1;

export interface TenantRankingTableCardProps {
    tenantId?: string;
    scopeParams?: AnalyticsScopeParams;
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    metricKey?: ANALYTICS_METRIC_KEY;
    onMetricChange?: (metricKey: ANALYTICS_METRIC_KEY) => void;
    onSelectEntity?: (item?: ContentItem) => void;
    enabled?: boolean;
    className?: string;
    paramPrefix?: string;
}

interface RankingFilter extends CommonParams {
    startDate?: string;
    endDate?: string;
    type?: ANALYTICS_VIEW_TYPE;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function TenantRankingTableCard({
    tenantId,
    scopeParams,
    fromDate,
    toDate,
    releaseType,
    metricKey,
    onMetricChange,
    onSelectEntity,
    enabled = true,
    className = 'rounded-xl border-none shadow-sm',
    paramPrefix,
}: TenantRankingTableCardProps) {
    const messages = useTranslations();

    const screens = Grid.useBreakpoint();
    const isMobile = screens.md === false;
    const fixedLeft = isMobile ? undefined : 'left';
    const fixedRight = isMobile ? undefined : 'right';

    const effectiveFromDate = fromDate || ANALYTICS_DEFAULT_START_DATE;
    const effectiveToDate = toDate || ANALYTICS_DEFAULT_END_DATE;

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<RankingFilter>(
            {
                page: DEFAULT_PAGE,
                pageSize: PAGE_SIZE_DEFAULT,
                startDate: effectiveFromDate,
                endDate: effectiveToDate,
                type: ANALYTICS_VIEW_TYPE.VIEW,
                releaseType: releaseType || ANALYTICS_RELEASE_TYPE.ALL,
            },
            { paramPrefix, history: paramPrefix ? 'replace' : 'push' }
        );

    const [currentType, setCurrentType] = useState<ANALYTICS_VIEW_TYPE>(() =>
        getAnalyticsViewType(dataFilter.type ?? null)
    );
    const [selectedReleaseType, setSelectedReleaseType] =
        useState<ANALYTICS_RELEASE_TYPE>(() =>
            getAnalyticsReleaseType(dataFilter.releaseType ?? null)
        );

    useEffect(() => {
        if (releaseType !== undefined) {
            setSelectedReleaseType(releaseType);
        }
    }, [releaseType]);

    const [detailModal, setDetailModal] = useState<{
        open: boolean;
        title: string;
        tenantId: string;
    }>({
        open: false,
        title: '',
        tenantId: '',
    });

    const [detailSourceModal, setDetailSourceModal] = useState<{
        open: boolean;
        title: string;
        sourceType: string;
    }>({
        open: false,
        title: '',
        sourceType: '',
    });

    const page = dataFilter.page ?? DEFAULT_PAGE;
    const pageSize = dataFilter.pageSize ?? PAGE_SIZE_DEFAULT;
    const isRevenue = metricKey
        ? metricKey !== ANALYTICS_METRIC_KEY.TOTAL_VIEWS
        : currentType === ANALYTICS_VIEW_TYPE.REVENUE;
    const revenueSortBy =
        metricKey === ANALYTICS_METRIC_KEY.TOTAL_USAGE
            ? 'usage'
            : metricKey === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD
              ? 'revenue'
              : undefined;

    const requestReleaseType =
        selectedReleaseType === ANALYTICS_RELEASE_TYPE.ALL
            ? undefined
            : selectedReleaseType;

    // Fetch ranking data (Views)
    const { tenantRankingData, isFetching: isViewsFetching } =
        useGetTenantRanking(
            {
                fromDate: effectiveFromDate,
                toDate: effectiveToDate,
                page,
                pageSize,
                keyword: dataFilter.keyword ?? undefined,
                groupBySource: true,
                releaseType: requestReleaseType,
                tenantId,
                ...scopeParams,
            },
            { enabled: enabled && !isRevenue }
        );

    // Fetch revenue ranking data
    const { topTenantData, isFetching: isRevenueFetching } =
        useGetRevenueTopTenant(
            {
                fromDate: effectiveFromDate,
                toDate: effectiveToDate,
                page,
                pageSize,
                keyword: dataFilter.keyword ?? undefined,
                includeOther: false,
                sortBy: revenueSortBy,
                groupBySource: true,
                releaseType: requestReleaseType,
                tenantId,
                ...scopeParams,
            },
            { enabled: enabled && isRevenue }
        );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const revenueColumns: ColumnsType<RevenueTenantItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
            align: 'center' as const,
            fixed: fixedLeft,
            render: (rank: number) => (
                <Typography.Text className="text-gray-700 dark:text-zinc-300">
                    #{rank}
                </Typography.Text>
            ),
        },
        {
            title: messages('tenant.name'),
            dataIndex: 'tenantName',
            key: 'tenantName',
            width: 250,
            ellipsis: true,
            fixed: fixedLeft,
            render: (text: string, record: RevenueTenantItem) => (
                <div className="flex items-center gap-3">
                    <ImageFallback
                        src={record.logo ?? ''}
                        alt={text}
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        className="aspect-square rounded-full object-cover"
                    />
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <Typography.Text
                            className="cursor-pointer transition-colors hover:text-blue-500"
                            onClick={() => {
                                // setDetailModal({
                                //     open: true,
                                //     title: text,
                                //     tenantId: record.tenantId,
                                // });
                                onSelectEntity?.({
                                    id: record.tenantId,
                                    title: text,
                                    type: ANALYTICS_ENTITY_TYPE.WORKSPACE,
                                    thumbnailUrl: record.logo ?? undefined,
                                });
                            }}
                        >
                            {text || '-'}
                        </Typography.Text>
                    </CustomTooltip>
                </div>
            ),
        },
        {
            title: messages('tenant.type.title'),
            dataIndex: 'type',
            key: 'type',
            width: 140,
            render: (type?: TENANT_TYPE) =>
                type ? <TenantTag type={type} /> : '-',
        },
        {
            title: messages('common.sourcePlatform'),
            dataIndex: 'bySource',
            key: 'bySource',
            width: 280,
            render: (bySource?: BySourceItem[]) => {
                if (!bySource || bySource.length === 0) return '-';
                return (
                    <div className="flex flex-wrap gap-1.5">
                        {bySource.map((item) => (
                            <CustomTooltip
                                key={item.source}
                                title={messages('common.detailedAnalysis')}
                            >
                                <Tag
                                    className="m-0 cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500"
                                    onClick={() => {
                                        // setDetailSourceModal({
                                        //     open: true,
                                        //     title: item.sourceLabel,
                                        //     sourceType: item.source,
                                        // });
                                        onSelectEntity?.({
                                            id: item.source,
                                            title: item.sourceLabel,
                                            type: ANALYTICS_ENTITY_TYPE.SOURCE_TYPE,
                                        });
                                    }}
                                >
                                    {item.sourceLabel}: $
                                    {formattedNumber(item.revenueUsd)}
                                </Tag>
                            </CustomTooltip>
                        ))}
                    </div>
                );
            },
        },
        {
            title: messages('common.usage'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: 150,
            fixed: fixedRight,
            render: (qty: number) => (
                <Typography.Text type="secondary">
                    {qty ? qty.toLocaleString() : 0}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.revenue'),
            dataIndex: 'revenueUsd',
            key: 'revenueUsd',
            width: 180,
            fixed: fixedRight,
            render: (val: number) => (
                <Typography.Text>
                    ${val ? formattedNumber(val) : '0.00'}
                </Typography.Text>
            ),
        },
    ];

    const viewsColumns: ColumnsType<TenantRankingItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
            align: 'center' as const,
            fixed: fixedLeft,
            render: (rank: number) => (
                <Typography.Text className="text-gray-700 dark:text-zinc-300">
                    #{rank}
                </Typography.Text>
            ),
        },
        {
            title: messages('tenant.name'),
            dataIndex: 'tenantName',
            key: 'tenantName',
            width: 250,
            ellipsis: true,
            fixed: fixedLeft,
            render: (text: string, record: TenantRankingItem) => (
                <div className="flex items-center gap-3">
                    <ImageFallback
                        src={record.logo ?? ''}
                        alt={text}
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        className="aspect-square rounded-full object-cover"
                    />
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <Typography.Text
                            className="cursor-pointer transition-colors hover:text-blue-500"
                            onClick={() => {
                                // setDetailModal({
                                //     open: true,
                                //     title: text,
                                //     tenantId: record.tenantId,
                                // });
                                onSelectEntity?.({
                                    id: record.tenantId,
                                    title: text,
                                    type: ANALYTICS_ENTITY_TYPE.WORKSPACE,
                                    thumbnailUrl: record.logo ?? undefined,
                                });
                            }}
                        >
                            {text || '-'}
                        </Typography.Text>
                    </CustomTooltip>
                </div>
            ),
        },
        {
            title: messages('tenant.type.title'),
            dataIndex: 'type',
            key: 'type',
            width: 140,
            render: (type?: TENANT_TYPE) =>
                type ? <TenantTag type={type} /> : '-',
        },
        {
            title: messages('common.sourcePlatform'),
            dataIndex: 'bySource',
            key: 'bySource',
            width: 280,
            render: (bySource?: BySourceItem[]) => {
                if (!bySource || bySource.length === 0) return '-';
                return (
                    <div className="flex flex-wrap gap-1.5">
                        {bySource.map((item) => (
                            <CustomTooltip
                                key={item.source}
                                title={messages('common.detailedAnalysis')}
                            >
                                <Tag
                                    className="m-0 cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500"
                                    onClick={() => {
                                        // setDetailSourceModal({
                                        //     open: true,
                                        //     title: item.sourceLabel,
                                        //     sourceType: item.source,
                                        // });
                                        onSelectEntity?.({
                                            id: item.source,
                                            title: item.sourceLabel,
                                            type: ANALYTICS_ENTITY_TYPE.SOURCE_TYPE,
                                        });
                                    }}
                                >
                                    {item.sourceLabel}:{' '}
                                    {formattedNumber(item.quantity)}
                                </Tag>
                            </CustomTooltip>
                        ))}
                    </div>
                );
            },
        },
        {
            title: messages('common.streams'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 180,
            fixed: fixedRight,
            render: (views: number) => (
                <Typography.Text>
                    {views ? views.toLocaleString() : 0}
                </Typography.Text>
            ),
        },
    ];

    return (
        <>
            <Card className={className}>
                <RankingTableFilter
                    keyword={dataFilter.keyword}
                    onSearch={onSearch}
                    showReleaseType
                    releaseType={selectedReleaseType}
                    onReleaseTypeChange={(selectedType) => {
                        setSelectedReleaseType(selectedType);
                        onChangeFilter({
                            releaseType:
                                selectedType === ANALYTICS_RELEASE_TYPE.ALL
                                    ? undefined
                                    : selectedType,
                        });
                    }}
                    showMetricType
                    metricType={
                        isRevenue
                            ? ANALYTICS_VIEW_TYPE.REVENUE
                            : ANALYTICS_VIEW_TYPE.VIEW
                    }
                    onMetricTypeChange={(nextType) => {
                        setCurrentType(nextType);
                        if (onMetricChange) {
                            onMetricChange(
                                nextType === ANALYTICS_VIEW_TYPE.VIEW
                                    ? ANALYTICS_METRIC_KEY.TOTAL_VIEWS
                                    : ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD
                            );
                            return;
                        }
                        onChangeFilter({ type: nextType });
                    }}
                />
                {isRevenue ? (
                    <Table<RevenueTenantItem>
                        key={isMobile ? 'mobile' : 'desktop'}
                        sticky
                        size="small"
                        columns={revenueColumns}
                        dataSource={topTenantData.items}
                        loading={isFetching}
                        rowKey="tenantId"
                        pagination={false}
                        scroll={{ x: SCREEN.LG }}
                    />
                ) : (
                    <Table<TenantRankingItem>
                        key={isMobile ? 'mobile' : 'desktop'}
                        sticky
                        size="small"
                        columns={viewsColumns}
                        dataSource={tenantRankingData.items}
                        loading={isFetching}
                        rowKey="tenantId"
                        pagination={false}
                        scroll={{ x: SCREEN.LG }}
                    />
                )}
                <AppPagination
                    align="end"
                    className="!mt-4"
                    current={page}
                    pageSize={pageSize}
                    total={
                        isRevenue
                            ? topTenantData?.metadata?.totalItems || 0
                            : tenantRankingData?.metadata?.totalItems || 0
                    }
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />
            </Card>

            {detailModal.open && (
                <DetailTenantAnalyticsModal
                    open={detailModal.open}
                    onClose={() =>
                        setDetailModal((prev) => ({ ...prev, open: false }))
                    }
                    title={detailModal.title}
                    tenantId={detailModal.tenantId}
                    fromDate={effectiveFromDate}
                    toDate={effectiveToDate}
                    releaseType={requestReleaseType}
                />
            )}

            {detailSourceModal.open && (
                <DetailSourceTypeAnalyticsModal
                    open={detailSourceModal.open}
                    onClose={() =>
                        setDetailSourceModal((prev) => ({
                            ...prev,
                            open: false,
                        }))
                    }
                    title={detailSourceModal.title}
                    sourceType={detailSourceModal.sourceType}
                    fromDate={effectiveFromDate}
                    toDate={effectiveToDate}
                    releaseType={requestReleaseType}
                />
            )}
        </>
    );
}
