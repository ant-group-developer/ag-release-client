'use client';

import AppPagination from '@/components/ui/pagination';
import PopoverTagsV2 from '@/components/ui/tag/popover-tags-v2';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { SCREEN } from '@/enums/common';
import { formattedNumber } from '@/helpers/common';
import DetailLabelAnalyticsModal from '@/modules/analytics2/components/detail-label/detail-label-analytics-modal';
import DetailReleaseAnalyticsModal from '@/modules/analytics2/components/detail-release/detail-release-analytics-modal';
import DetailSourceTypeAnalyticsModal from '@/modules/analytics2/components/detail-source-type/detail-source-type-analytics-modal';
import DetailTenantAnalyticsModal from '@/modules/analytics2/components/detail-tenant/detail-tenant-analytics-modal';
import { ANALYTICS_RANKING_THUMBNAIL_SIZE } from '@/modules/analytics2/constants/types';
import { ANALYTICS_RELEASE_TYPE } from '@/modules/analytics2/enums';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import { useGetReleaseRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopRelease } from '@/modules/analytics2/hooks/use-get-revenue-data';
import {
    ReleaseRankingItem,
    RevenueReleaseItem,
} from '@/modules/analytics2/types';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { Avatar, Card, Segmented, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const DEFAULT_PAGE = 1;

interface AdvancedModeReleaseTableProps {
    fromDate: string;
    toDate: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    onSelectRelease?: (releaseId: string) => void;
}

export default function AdvancedModeReleaseTable({
    fromDate,
    toDate,
    releaseType,
    onSelectRelease,
}: AdvancedModeReleaseTableProps) {
    const messages = useTranslations();

    const [page, setPage] = useState(DEFAULT_PAGE);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
    const [keyword, setKeyword] = useState('');
    const [currentType, setCurrentType] = useState<ANALYTICS_VIEW_TYPE>(
        ANALYTICS_VIEW_TYPE.VIEW
    );
    const [selectedReleaseType, setSelectedReleaseType] =
        useState<ANALYTICS_RELEASE_TYPE>(
            releaseType || ANALYTICS_RELEASE_TYPE.ALL
        );

    const [activeDetail, setActiveDetail] = useState<{
        type: 'release' | 'source' | 'label' | 'tenant' | null;
        title: string;
        targetId: string;
    }>({
        type: null,
        title: '',
        targetId: '',
    });

    const isRevenue = currentType === ANALYTICS_VIEW_TYPE.REVENUE;
    const requestReleaseType =
        selectedReleaseType === ANALYTICS_RELEASE_TYPE.ALL
            ? undefined
            : selectedReleaseType;

    // Fetch ranking data (Views)
    const { releaseRankingData, isFetching: isViewsFetching } =
        useGetReleaseRanking(
            {
                fromDate,
                toDate,
                page,
                pageSize,
                keyword,
                groupBySource: true,
                releaseType: requestReleaseType,
            },
            { enabled: !isRevenue }
        );

    // Fetch revenue ranking data
    const { topReleaseData, isFetching: isRevenueFetching } =
        useGetRevenueTopRelease(
            {
                fromDate,
                toDate,
                page,
                pageSize,
                keyword,
                includeOther: false,
                groupBySource: true,
                releaseType: requestReleaseType,
            },
            { enabled: isRevenue }
        );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const revenueColumns: ColumnsType<RevenueReleaseItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
            align: 'center' as const,
            fixed: 'left',
            render: (rank: number) => (
                <Typography.Text type="secondary">#{rank}</Typography.Text>
            ),
        },
        {
            title: messages('common.release'),
            dataIndex: 'title',
            key: 'title',
            width: 350,
            ellipsis: true,
            fixed: 'left',
            render: (text: string, record: RevenueReleaseItem) => (
                <div className="flex items-center gap-3">
                    <ReleaseCoverImage
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        fileId={
                            record.release?.coverArtThumbnails?.[
                                RELEASE_COVER_ART_SIZE.S75
                            ] as string
                        }
                    />
                    <div className="flex min-w-0 max-w-[350px] flex-col">
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <Typography.Text
                                className="cursor-pointer truncate transition-colors hover:text-blue-500"
                                onClick={() => {
                                    onSelectRelease?.(record.releaseId);
                                    setActiveDetail({
                                        type: 'release',
                                        title: text,
                                        targetId: record.releaseId,
                                    });
                                }}
                            >
                                {text}
                            </Typography.Text>
                        </CustomTooltip>
                    </div>
                </div>
            ),
        },
        {
            title: 'UPC',
            dataIndex: 'upc',
            key: 'upc',
            width: 160,
            ellipsis: true,
            render: (text: string) => (
                <Typography.Text type="secondary" className="truncate">
                    {text || '—'}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: 180,
            ellipsis: true,
            render: (text: string, record: RevenueReleaseItem) => {
                if (!record.labelId) {
                    return (
                        <Typography.Text className="truncate">
                            {text || '—'}
                        </Typography.Text>
                    );
                }
                return (
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
                );
            },
        },
        {
            title: messages('common.workspace'),
            key: 'workspace',
            width: 240,
            ellipsis: true,
            render: (_, record: RevenueReleaseItem) => {
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
            title: messages('common.onlineLink'),
            key: 'onlineLink',
            width: 150,
            render: (_, record: RevenueReleaseItem) => {
                const metadataExternal = record?.metadataExternal;
                if (!metadataExternal) return '—';
                const entries = Object.entries(metadataExternal).filter(
                    ([, metadata]) => !!metadata?.albumUrl
                );
                if (entries.length === 0) return '—';
                return (
                    <PopoverTagsV2
                        items={entries}
                        maxVisibleTags={1}
                        getKey={([key]) => key}
                        renderItem={([key, metadata]) => {
                            const labelName =
                                key.charAt(0).toUpperCase() + key.slice(1);
                            return (
                                <CustomTooltip
                                    key={key}
                                    title={messages('common.seeMore')}
                                >
                                    <a
                                        href={metadata?.albumUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Tag className="!m-0 cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500">
                                            {labelName}
                                        </Tag>
                                    </a>
                                </CustomTooltip>
                            );
                        }}
                    />
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
            title: messages('common.tracks'),
            dataIndex: 'trackCount',
            key: 'trackCount',
            width: 120,
            render: (count: number) => (
                <Typography.Text type="secondary">{count || 0}</Typography.Text>
            ),
        },
        {
            title: messages('common.usage'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: 140,
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
            width: 150,
            fixed: 'right',
            render: (val: number) => (
                <Typography.Text strong>
                    ${val ? formattedNumber(val) : '0.00'}
                </Typography.Text>
            ),
        },
    ];

    const viewColumns: ColumnsType<ReleaseRankingItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
            align: 'center' as const,
            fixed: 'left',
            render: (rank: number) => (
                <Typography.Text type="secondary">#{rank}</Typography.Text>
            ),
        },
        {
            title: messages('common.release'),
            dataIndex: 'title',
            key: 'title',
            width: 350,
            ellipsis: true,
            fixed: 'left',
            render: (text: string, record: ReleaseRankingItem) => (
                <div className="flex items-center gap-3">
                    <ReleaseCoverImage
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        fileId={
                            record.release?.coverArtThumbnails?.[
                                RELEASE_COVER_ART_SIZE.S75
                            ] as string
                        }
                    />
                    <div className="flex min-w-0 max-w-[350px] flex-col">
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <Typography.Text
                                className="cursor-pointer truncate transition-colors hover:text-blue-500"
                                onClick={() => {
                                    onSelectRelease?.(record.releaseId);
                                    setActiveDetail({
                                        type: 'release',
                                        title: text,
                                        targetId: record.releaseId,
                                    });
                                }}
                            >
                                {text}
                            </Typography.Text>
                        </CustomTooltip>
                    </div>
                </div>
            ),
        },
        {
            title: 'UPC',
            dataIndex: 'upc',
            key: 'upc',
            width: 160,
            ellipsis: true,
            render: (text: string) => (
                <Typography.Text type="secondary" className="truncate">
                    {text || '—'}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: 180,
            ellipsis: true,
            render: (text: string, record: ReleaseRankingItem) => {
                if (!record.labelId) {
                    return (
                        <Typography.Text className="truncate">
                            {text || '—'}
                        </Typography.Text>
                    );
                }
                return (
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
                );
            },
        },
        {
            title: messages('common.workspace'),
            key: 'workspace',
            width: 240,
            ellipsis: true,
            render: (_, record: ReleaseRankingItem) => {
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
                                {workspaceName}
                            </Typography.Text>
                        </CustomTooltip>
                    </div>
                );
            },
        },
        {
            title: messages('common.onlineLink'),
            key: 'onlineLink',
            width: 150,
            render: (_, record: ReleaseRankingItem) => {
                const metadataExternal = record?.metadataExternal;
                if (!metadataExternal) return '—';
                const entries = Object.entries(metadataExternal).filter(
                    ([, metadata]) => !!metadata?.albumUrl
                );
                if (entries.length === 0) return '—';
                return (
                    <PopoverTagsV2
                        items={entries}
                        maxVisibleTags={1}
                        getKey={([key]) => key}
                        renderItem={([key, metadata]) => {
                            const labelName =
                                key.charAt(0).toUpperCase() + key.slice(1);
                            return (
                                <CustomTooltip
                                    key={key}
                                    title={messages('common.seeMore')}
                                >
                                    <a
                                        href={metadata?.albumUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Tag className="!m-0 cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500">
                                            {labelName}
                                        </Tag>
                                    </a>
                                </CustomTooltip>
                            );
                        }}
                    />
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
                                    {item.sourceLabel}:{' '}
                                    {formattedNumber(item.views)}
                                </Tag>
                            </CustomTooltip>
                        )}
                    />
                );
            },
        },
        {
            title: messages('common.tracks'),
            dataIndex: 'trackCount',
            key: 'trackCount',
            width: 120,
            render: (count: number) => (
                <Typography.Text type="secondary">{count || 0}</Typography.Text>
            ),
        },
        {
            title: messages('analytics.totalTrendViews'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 180,
            fixed: 'right',
            render: (val: number) => (
                <Typography.Text strong>
                    {val ? formattedNumber(val) : 0}
                </Typography.Text>
            ),
        },
    ];

    return (
        <Card className="shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Segmented
                        value={selectedReleaseType}
                        onChange={(value) => {
                            setSelectedReleaseType(
                                value as ANALYTICS_RELEASE_TYPE
                            );
                            setPage(DEFAULT_PAGE);
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
                </div>
            </div>

            {isRevenue ? (
                <Table<RevenueReleaseItem>
                    sticky
                    size="small"
                    columns={revenueColumns}
                    dataSource={topReleaseData?.items}
                    loading={isFetching}
                    rowKey="releaseId"
                    pagination={false}
                    scroll={{ x: SCREEN.LG }}
                />
            ) : (
                <Table<ReleaseRankingItem>
                    sticky
                    size="small"
                    columns={viewColumns}
                    dataSource={releaseRankingData?.items}
                    loading={isFetching}
                    rowKey="releaseId"
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
                        ? topReleaseData?.metadata?.totalItems || 0
                        : releaseRankingData?.metadata?.totalItems || 0
                }
                onChange={(p, ps) => {
                    setPage(p);
                    setPageSize(ps);
                }}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            {/* Modal chi tiết nếu click vào item */}
            {activeDetail.type === 'release' && (
                <DetailReleaseAnalyticsModal
                    open={activeDetail.type === 'release'}
                    onClose={() =>
                        setActiveDetail((prev) => ({ ...prev, type: null }))
                    }
                    title={activeDetail.title}
                    releaseId={activeDetail.targetId}
                    fromDate={fromDate}
                    toDate={toDate}
                    releaseType={releaseType}
                />
            )}

            {activeDetail.type === 'label' && (
                <DetailLabelAnalyticsModal
                    open={activeDetail.type === 'label'}
                    onClose={() =>
                        setActiveDetail((prev) => ({ ...prev, type: null }))
                    }
                    title={activeDetail.title}
                    labelId={activeDetail.targetId}
                    fromDate={fromDate}
                    toDate={toDate}
                    releaseType={releaseType}
                />
            )}

            {activeDetail.type === 'tenant' && (
                <DetailTenantAnalyticsModal
                    open={activeDetail.type === 'tenant'}
                    onClose={() =>
                        setActiveDetail((prev) => ({ ...prev, type: null }))
                    }
                    title={activeDetail.title}
                    tenantId={activeDetail.targetId}
                    fromDate={fromDate}
                    toDate={toDate}
                    releaseType={releaseType}
                />
            )}

            {activeDetail.type === 'source' && (
                <DetailSourceTypeAnalyticsModal
                    open={activeDetail.type === 'source'}
                    onClose={() =>
                        setActiveDetail((prev) => ({ ...prev, type: null }))
                    }
                    title={activeDetail.title}
                    sourceType={activeDetail.targetId}
                    fromDate={fromDate}
                    toDate={toDate}
                    releaseType={releaseType}
                />
            )}
        </Card>
    );
}
