'use client';

import ImageFallback from '@/components/ui/image/image-fallback';
import AppPagination from '@/components/ui/pagination';
import AppProTable from '@/components/ui/table/pro-table';
import PopoverTagsV2 from '@/components/ui/tag/popover-tags-v2';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { SCREEN } from '@/enums/common';
import { formattedNumber } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
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
import { useAutoSelectTopRows } from '@/modules/analytics2/hooks/use-auto-select-top-rows';
import { useGetLabelRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopLabel } from '@/modules/analytics2/hooks/use-get-revenue-data';
import { LabelRankingItem, RevenueLabelItem } from '@/modules/analytics2/types';
import { CommonParams } from '@/types/api';
import type { ProColumns } from '@ant-design/pro-components';
import { Avatar, Card, Grid, Space, Tag, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import RankingTableFilter from './ranking-table-filter';

const DEFAULT_PAGE = 1;

const RELEASES_COLUMN_WIDTH = 140;
const TRACKS_COLUMN_WIDTH = 140;
const TENANT_COLUMN_WIDTH = 180;
const QUANTITY_COLUMN_WIDTH = 140;
const REVENUE_COLUMN_WIDTH = 160;
const VIEWS_COLUMN_WIDTH = 160;
const LABEL_COLUMN_WIDTH = 300;

export interface LabelRankingTableCardProps {
    labelId?: string;
    scopeParams?: AnalyticsScopeParams;
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    metricKey?: ANALYTICS_METRIC_KEY;
    onMetricChange?: (metricKey: ANALYTICS_METRIC_KEY) => void;
    onSelectEntity?: (item?: ContentItem) => void;
    selectedRowKeys?: string[];
    onSelectedRowKeysChange?: (keys: string[]) => void;
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

export default function LabelRankingTableCard({
    labelId,
    scopeParams,
    fromDate,
    toDate,
    releaseType,
    metricKey,
    onMetricChange,
    onSelectEntity,
    selectedRowKeys,
    onSelectedRowKeysChange,
    enabled = true,
    className = 'rounded-xl border-none shadow-sm',
    paramPrefix,
}: LabelRankingTableCardProps) {
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
    const { labelRankingData, isFetching: isViewsFetching } =
        useGetLabelRanking(
            {
                fromDate: effectiveFromDate,
                toDate: effectiveToDate,
                page,
                pageSize,
                keyword: dataFilter.keyword,
                groupBySource: true,
                releaseType: requestReleaseType,
                labelId,
                ...scopeParams,
            },
            { enabled: enabled && !isRevenue }
        );

    // Fetch revenue ranking data
    const { topLabelData, isFetching: isRevenueFetching } =
        useGetRevenueTopLabel(
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
                labelId,
                ...scopeParams,
            },
            { enabled: enabled && isRevenue }
        );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const currentItems = isRevenue
        ? topLabelData.items
        : labelRankingData.items;

    useAutoSelectTopRows({
        items: currentItems,
        rowKey: 'labelId',
        selectedRowKeys,
        onSelectedRowKeysChange,
        enabled,
        resetDeps: [
            metricKey,
            isRevenue,
            selectedReleaseType,
            dataFilter.keyword,
            effectiveFromDate,
            effectiveToDate,
            labelId,
        ],
    });

    const revenueColumns: ProColumns<RevenueLabelItem>[] = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
            align: 'center' as const,
            fixed: fixedLeft,
            render: (_, record: RevenueLabelItem) => (
                <Typography.Text type="secondary">
                    #{record.rank}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: LABEL_COLUMN_WIDTH,
            ellipsis: true,
            fixed: fixedLeft,
            render: (_, record: RevenueLabelItem) => (
                <div className="flex items-center gap-3">
                    <ImageFallback
                        src={record.logoUrl ?? record.picture ?? ''}
                        alt={record.labelName}
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        className="aspect-square rounded-full object-cover"
                    />
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <Typography.Text
                            className="cursor-pointer transition-colors hover:text-blue-500"
                            onClick={() => {
                                onSelectEntity?.({
                                    id: record.labelId,
                                    title: record.labelName,
                                    type: ANALYTICS_ENTITY_TYPE.LABEL,
                                    thumbnailUrl:
                                        record.logoUrl ??
                                        record.picture ??
                                        undefined,
                                });
                            }}
                        >
                            {record.labelName || '-'}
                        </Typography.Text>
                    </CustomTooltip>
                </div>
            ),
        },
        {
            title: messages('common.workspace'),
            key: 'workspace',
            width: TENANT_COLUMN_WIDTH,
            ellipsis: true,
            render: (_, record: RevenueLabelItem) => {
                const workspace = record?.workspaces?.[0];
                const workspaceName = workspace?.name;

                if (!workspaceName) {
                    return (
                        <Typography.Text className="truncate">
                            {workspaceName || '-'}
                        </Typography.Text>
                    );
                }
                return (
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <Space>
                            <Avatar src={workspace?.logo as string} />
                            <Typography.Text
                                className="cursor-pointer transition-colors hover:text-blue-500"
                                onClick={() => {
                                    onSelectEntity?.({
                                        id: workspace?.id || '',
                                        title: workspaceName || '',
                                        type: ANALYTICS_ENTITY_TYPE.WORKSPACE,
                                    });
                                }}
                            >
                                {workspaceName || '-'}
                            </Typography.Text>
                        </Space>
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('common.sourcePlatform'),
            dataIndex: 'bySource',
            key: 'bySource',
            width: 280,
            render: (_, record: RevenueLabelItem) => {
                const bySource = record.bySource;
                if (!bySource || bySource.length === 0) return '-';
                return (
                    <PopoverTagsV2
                        items={bySource}
                        maxVisibleTags={1}
                        getKey={(item) => item.source}
                        renderItem={(item) => (
                            <CustomTooltip
                                key={item.source}
                                title={messages('common.detailedAnalysis')}
                            >
                                <Tag
                                    className="!m-0 cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500"
                                    onClick={() => {
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
                        )}
                    />
                );
            },
        },
        {
            title: messages('common.releases'),
            dataIndex: 'releaseCount',
            key: 'releaseCount',
            width: RELEASES_COLUMN_WIDTH,
            render: (_, record: RevenueLabelItem) => (
                <Typography.Text type="secondary">
                    {record.releaseCount || 0}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.tracks'),
            dataIndex: 'trackCount',
            key: 'trackCount',
            width: TRACKS_COLUMN_WIDTH,
            render: (_, record: RevenueLabelItem) => (
                <Typography.Text type="secondary">
                    {record.trackCount || 0}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.usage'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: QUANTITY_COLUMN_WIDTH,
            fixed: fixedRight,
            render: (_, record: RevenueLabelItem) => (
                <Typography.Text type="secondary">
                    {record.quantity ? record.quantity.toLocaleString() : 0}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.revenue'),
            dataIndex: 'revenueUsd',
            key: 'revenueUsd',
            width: REVENUE_COLUMN_WIDTH,
            fixed: fixedRight,
            render: (_, record: RevenueLabelItem) => (
                <Typography.Text>
                    $
                    {record.revenueUsd
                        ? formattedNumber(record.revenueUsd)
                        : '0.00'}
                </Typography.Text>
            ),
        },
    ];

    const viewColumns: ProColumns<LabelRankingItem>[] = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
            align: 'center' as const,
            fixed: fixedLeft,
            render: (_, record: LabelRankingItem) => (
                <Typography.Text type="secondary">
                    #{record.rank}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: LABEL_COLUMN_WIDTH,
            ellipsis: true,
            fixed: fixedLeft,
            render: (_, record: LabelRankingItem) => (
                <div className="flex items-center gap-3">
                    <ImageFallback
                        src={record.logoUrl ?? ''}
                        alt={record.labelName}
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        className="aspect-square rounded-full object-cover"
                    />
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <Typography.Text
                            className="cursor-pointer transition-colors hover:text-blue-500"
                            onClick={() => {
                                onSelectEntity?.({
                                    id: record.labelId,
                                    title: record.labelName,
                                    type: ANALYTICS_ENTITY_TYPE.LABEL,
                                    thumbnailUrl:
                                        record.logoUrl ??
                                        record.picture ??
                                        undefined,
                                });
                            }}
                        >
                            {record.labelName || '-'}
                        </Typography.Text>
                    </CustomTooltip>
                </div>
            ),
        },
        {
            title: messages('common.workspace'),
            key: 'workspace',
            width: TENANT_COLUMN_WIDTH,
            ellipsis: true,
            render: (_, record: LabelRankingItem) => {
                const workspace = record?.workspaces?.[0];
                const workspaceName = workspace?.name;
                const tenantId = workspace?.id;
                if (!tenantId) return '-';
                return (
                    <div className="flex items-center gap-2">
                        <Avatar src={workspace?.logo} size={32} />
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <Typography.Text
                                className="cursor-pointer transition-colors hover:text-blue-500"
                                onClick={() => {
                                    onSelectEntity?.({
                                        id: tenantId,
                                        title: workspaceName || '',
                                        type: ANALYTICS_ENTITY_TYPE.WORKSPACE,
                                    });
                                }}
                            >
                                {workspaceName || '-'}
                            </Typography.Text>
                        </CustomTooltip>
                    </div>
                );
            },
        },
        {
            title: messages('common.sourcePlatform'),
            dataIndex: 'bySource',
            key: 'bySource',
            width: 200,
            render: (_, record: LabelRankingItem) => {
                const bySource = record.bySource;
                if (!bySource || bySource.length === 0) return '-';
                return (
                    <PopoverTagsV2
                        items={bySource}
                        maxVisibleTags={1}
                        getKey={(item) => item.source}
                        renderItem={(item) => (
                            <CustomTooltip
                                key={item.source}
                                title={messages('common.detailedAnalysis')}
                            >
                                <Tag
                                    className="!m-0 cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500"
                                    onClick={() => {
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
                        )}
                    />
                );
            },
        },
        {
            title: messages('common.releases'),
            dataIndex: 'releaseCount',
            key: 'releaseCount',
            width: RELEASES_COLUMN_WIDTH,
            render: (_, record: LabelRankingItem) => (
                <Typography.Text type="secondary">
                    {record.releaseCount || 0}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.tracks'),
            dataIndex: 'trackCount',
            key: 'trackCount',
            width: TRACKS_COLUMN_WIDTH,
            render: (_, record: LabelRankingItem) => (
                <Typography.Text type="secondary">
                    {record.trackCount || 0}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.streams'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: VIEWS_COLUMN_WIDTH,
            fixed: fixedRight,
            render: (_, record: LabelRankingItem) => (
                <Typography.Text>
                    {record.totalViews ? record.totalViews.toLocaleString() : 0}
                </Typography.Text>
            ),
        },
    ];

    return (
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
                <AppProTable<RevenueLabelItem>
                    key={isMobile ? 'mobile' : 'desktop'}
                    options={false}
                    sticky
                    size="small"
                    columns={revenueColumns}
                    dataSource={topLabelData.items}
                    loading={isFetching}
                    rowKey="labelId"
                    rowSelection={
                        onSelectedRowKeysChange
                            ? {
                                  selectedRowKeys,
                                  preserveSelectedRowKeys: true,
                                  onChange: (keys) =>
                                      onSelectedRowKeysChange(keys.map(String)),
                              }
                            : undefined
                    }
                    pagination={false}
                    search={false}
                    scroll={{ x: SCREEN.LG }}
                />
            ) : (
                <AppProTable<LabelRankingItem>
                    key={isMobile ? 'mobile' : 'desktop'}
                    options={false}
                    sticky
                    size="small"
                    columns={viewColumns}
                    dataSource={labelRankingData.items}
                    loading={isFetching}
                    rowKey="labelId"
                    rowSelection={
                        onSelectedRowKeysChange
                            ? {
                                  selectedRowKeys,
                                  preserveSelectedRowKeys: true,
                                  onChange: (keys) =>
                                      onSelectedRowKeysChange(keys.map(String)),
                              }
                            : undefined
                    }
                    pagination={false}
                    search={false}
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
                        ? topLabelData?.metadata?.totalItems || 0
                        : labelRankingData?.metadata?.totalItems || 0
                }
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
        </Card>
    );
}
