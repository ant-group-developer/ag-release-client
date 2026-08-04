'use client';

import ImageFallback from '@/components/ui/image/image-fallback';
import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import PopoverTagsV2 from '@/components/ui/tag/popover-tags-v2';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { SCREEN } from '@/enums/common';
import { formattedNumber } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import DetailLabelAnalyticsModal from '@/modules/analytics2/components/detail-label/detail-label-analytics-modal';
import DetailSourceTypeAnalyticsModal from '@/modules/analytics2/components/detail-source-type/detail-source-type-analytics-modal';
import DetailTenantAnalyticsModal from '@/modules/analytics2/components/detail-tenant/detail-tenant-analytics-modal';
import {
    ANALYTICS_DEFAULT_END_DATE,
    ANALYTICS_DEFAULT_START_DATE,
    ANALYTICS_RANKING_THUMBNAIL_SIZE,
} from '@/modules/analytics2/constants/types';
import { ANALYTICS_RELEASE_TYPE } from '@/modules/analytics2/enums';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import { useGetLabelRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopLabel } from '@/modules/analytics2/hooks/use-get-revenue-data';
import { LabelRankingItem, RevenueLabelItem } from '@/modules/analytics2/types';
import { CommonParams } from '@/types/api';
import { Avatar, Card, Segmented, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const DEFAULT_PAGE = 1;

const RELEASES_COLUMN_WIDTH = 140;
const TRACKS_COLUMN_WIDTH = 140;
const TENANT_COLUMN_WIDTH = 180;
const QUANTITY_COLUMN_WIDTH = 140;
const REVENUE_COLUMN_WIDTH = 160;
const VIEWS_COLUMN_WIDTH = 160;
const LABEL_COLUMN_WIDTH = 300;

export interface LabelRankingTableCardProps {
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    enabled?: boolean;
    className?: string;
}

interface RankingFilter extends CommonParams {
    startDate?: string;
    endDate?: string;
    type?: ANALYTICS_VIEW_TYPE;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function LabelRankingTableCard({
    fromDate,
    toDate,
    releaseType,
    enabled = true,
    className = 'rounded-xl border-none shadow-sm',
}: LabelRankingTableCardProps) {
    const messages = useTranslations();

    const effectiveFromDate = fromDate || ANALYTICS_DEFAULT_START_DATE;
    const effectiveToDate = toDate || ANALYTICS_DEFAULT_END_DATE;

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<RankingFilter>({
            page: DEFAULT_PAGE,
            pageSize: PAGE_SIZE_DEFAULT,
            startDate: effectiveFromDate,
            endDate: effectiveToDate,
            type: ANALYTICS_VIEW_TYPE.VIEW,
            releaseType: releaseType || ANALYTICS_RELEASE_TYPE.ALL,
        });

    const [currentType, setCurrentType] = useState<ANALYTICS_VIEW_TYPE>(
        ANALYTICS_VIEW_TYPE.VIEW
    );
    const [selectedReleaseType, setSelectedReleaseType] =
        useState<ANALYTICS_RELEASE_TYPE>(
            releaseType || ANALYTICS_RELEASE_TYPE.ALL
        );

    useEffect(() => {
        if (releaseType !== undefined) {
            setSelectedReleaseType(releaseType);
        }
    }, [releaseType]);

    const [activeDetail, setActiveDetail] = useState<{
        type: 'source' | 'label' | 'tenant' | null;
        title: string;
        targetId: string;
    }>({
        type: null,
        title: '',
        targetId: '',
    });

    const page = dataFilter.page ?? DEFAULT_PAGE;
    const pageSize = dataFilter.pageSize ?? PAGE_SIZE_DEFAULT;
    const isRevenue = currentType === ANALYTICS_VIEW_TYPE.REVENUE;

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
                groupBySource: true,
                releaseType: requestReleaseType,
            },
            { enabled: enabled && isRevenue }
        );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const revenueColumns: ColumnsType<RevenueLabelItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
            align: 'center' as const,
            fixed: 'left',
            render: (rank: number) => (
                <Typography.Text className="text-gray-700 dark:text-zinc-300">
                    #{rank}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: LABEL_COLUMN_WIDTH,
            ellipsis: true,
            fixed: 'left',
            render: (text: string, record: RevenueLabelItem) => (
                <div className="flex items-center gap-3">
                    <ImageFallback
                        src={record.logoUrl ?? record.picture ?? ''}
                        alt={text}
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        className="aspect-square rounded-full object-cover"
                    />
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <Typography.Text
                            className="cursor-pointer transition-colors hover:text-blue-500"
                            onClick={() =>
                                setActiveDetail({
                                    type: 'label',
                                    title: text,
                                    targetId: record.labelId,
                                })
                            }
                        >
                            {text || '—'}
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
                            {workspaceName || '—'}
                        </Typography.Text>
                    );
                }
                return (
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <Space>
                            <Avatar src={workspace?.logo as string} />
                            <Typography.Text
                                className="cursor-pointer transition-colors hover:text-blue-500"
                                onClick={() =>
                                    setActiveDetail({
                                        type: 'tenant',
                                        title: workspaceName || '',
                                        targetId: workspace?.id,
                                    })
                                }
                            >
                                {workspaceName || '—'}
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
            render: (bySource?: any[]) => {
                if (!bySource || bySource.length === 0) return '—';
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
                                    onClick={() =>
                                        setActiveDetail({
                                            type: 'source',
                                            title: item.sourceLabel,
                                            targetId: item.source,
                                        })
                                    }
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
            render: (count: number) => (
                <Typography.Text type="secondary">{count || 0}</Typography.Text>
            ),
        },
        {
            title: messages('common.tracks'),
            dataIndex: 'trackCount',
            key: 'trackCount',
            width: TRACKS_COLUMN_WIDTH,
            render: (count: number) => (
                <Typography.Text type="secondary">{count || 0}</Typography.Text>
            ),
        },
        {
            title: messages('common.usage'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: QUANTITY_COLUMN_WIDTH,
            fixed: 'right',
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
            width: REVENUE_COLUMN_WIDTH,
            fixed: 'right',
            render: (val: number) => (
                <Typography.Text>
                    ${val ? formattedNumber(val) : '0.00'}
                </Typography.Text>
            ),
        },
    ];

    const viewColumns: ColumnsType<LabelRankingItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
            align: 'center' as const,
            fixed: 'left',
            render: (rank: number) => (
                <Typography.Text className="text-gray-700 dark:text-zinc-300">
                    #{rank}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: LABEL_COLUMN_WIDTH,
            ellipsis: true,
            fixed: 'left',
            render: (text: string, record: LabelRankingItem) => (
                <div className="flex items-center gap-3">
                    <ImageFallback
                        src={record.logoUrl ?? ''}
                        alt={text}
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        className="aspect-square rounded-full object-cover"
                    />
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <Typography.Text
                            className="cursor-pointer transition-colors hover:text-blue-500"
                            onClick={() =>
                                setActiveDetail({
                                    type: 'label',
                                    title: text,
                                    targetId: record.labelId,
                                })
                            }
                        >
                            {text || '—'}
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
                                onClick={() =>
                                    setActiveDetail({
                                        type: 'tenant',
                                        title: workspaceName || '',
                                        targetId: tenantId,
                                    })
                                }
                            >
                                {workspaceName || '—'}
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
            render: (bySource?: any[]) => {
                if (!bySource || bySource.length === 0) return '—';
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
                                    onClick={() =>
                                        setActiveDetail({
                                            type: 'source',
                                            title: item.sourceLabel,
                                            targetId: item.source,
                                        })
                                    }
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
            render: (count: number) => (
                <Typography.Text type="secondary">{count || 0}</Typography.Text>
            ),
        },
        {
            title: messages('common.tracks'),
            dataIndex: 'trackCount',
            key: 'trackCount',
            width: TRACKS_COLUMN_WIDTH,
            render: (count: number) => (
                <Typography.Text type="secondary">{count || 0}</Typography.Text>
            ),
        },
        {
            title: messages('common.streams'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: VIEWS_COLUMN_WIDTH,
            fixed: 'right',
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
                <div className="mb-4 flex items-center gap-2">
                    <AppSearch
                        onChange={onSearch}
                        defaultValue={dataFilter.keyword}
                        style={{ width: 200 }}
                    />
                    <Segmented
                        value={selectedReleaseType}
                        onChange={(value) => {
                            const selectedType =
                                value as ANALYTICS_RELEASE_TYPE;
                            setSelectedReleaseType(selectedType);
                            onChangeFilter({
                                releaseType:
                                    selectedType === ANALYTICS_RELEASE_TYPE.ALL
                                        ? undefined
                                        : selectedType,
                            });
                        }}
                        options={[
                            {
                                label: messages('common.all'),
                                value: ANALYTICS_RELEASE_TYPE.ALL,
                            },
                            {
                                label: messages('common.audio'),
                                value: ANALYTICS_RELEASE_TYPE.AUDIO,
                            },
                            {
                                label: messages('common.video'),
                                value: ANALYTICS_RELEASE_TYPE.VIDEO,
                            },
                        ]}
                    />
                    <Segmented
                        value={currentType}
                        onChange={(value) => {
                            setCurrentType(value as ANALYTICS_VIEW_TYPE);
                            onChangeFilter({
                                type: value as ANALYTICS_VIEW_TYPE,
                            });
                        }}
                        options={[
                            {
                                label: messages('common.views'),
                                value: ANALYTICS_VIEW_TYPE.VIEW,
                            },
                            {
                                label: messages('common.revenue'),
                                value: ANALYTICS_VIEW_TYPE.REVENUE,
                            },
                        ]}
                    />
                </div>
                {isRevenue ? (
                    <Table<RevenueLabelItem>
                        sticky
                        size="small"
                        columns={revenueColumns}
                        dataSource={topLabelData.items}
                        loading={isFetching}
                        rowKey="labelId"
                        pagination={false}
                        scroll={{ x: SCREEN.LG }}
                    />
                ) : (
                    <Table<LabelRankingItem>
                        sticky
                        size="small"
                        columns={viewColumns}
                        dataSource={labelRankingData.items}
                        loading={isFetching}
                        rowKey="labelId"
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

            {activeDetail.type === 'label' && (
                <DetailLabelAnalyticsModal
                    open={true}
                    onClose={() =>
                        setActiveDetail((prev) => ({ ...prev, type: null }))
                    }
                    title={activeDetail.title}
                    labelId={activeDetail.targetId}
                    fromDate={effectiveFromDate}
                    toDate={effectiveToDate}
                    releaseType={requestReleaseType}
                />
            )}

            {activeDetail.type === 'source' && (
                <DetailSourceTypeAnalyticsModal
                    open={true}
                    onClose={() =>
                        setActiveDetail((prev) => ({
                            ...prev,
                            type: null,
                        }))
                    }
                    title={activeDetail.title}
                    sourceType={activeDetail.targetId}
                    fromDate={effectiveFromDate}
                    toDate={effectiveToDate}
                    releaseType={requestReleaseType}
                />
            )}

            {activeDetail.type === 'tenant' && (
                <DetailTenantAnalyticsModal
                    open={true}
                    onClose={() =>
                        setActiveDetail((prev) => ({
                            ...prev,
                            type: null,
                        }))
                    }
                    title={activeDetail.title}
                    tenantId={activeDetail.targetId}
                    fromDate={effectiveFromDate}
                    toDate={effectiveToDate}
                    releaseType={requestReleaseType}
                />
            )}
        </>
    );
}
