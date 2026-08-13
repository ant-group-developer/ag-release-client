'use client';

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
import { useGetReleaseRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopRelease } from '@/modules/analytics2/hooks/use-get-revenue-data';
import {
    ReleaseRankingItem,
    RevenueReleaseItem,
} from '@/modules/analytics2/types';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { CommonParams } from '@/types/api';
import type { ProColumns } from '@ant-design/pro-components';
import { Avatar, Card, Grid, Space, Tag, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import RankingTableFilter from './ranking-table-filter';

const DEFAULT_PAGE = 1;

export interface ReleaseRankingTableCardProps {
    releaseId?: string;
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

export default function ReleaseRankingTableCard({
    releaseId,
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
}: ReleaseRankingTableCardProps) {
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
    const { releaseRankingData, isFetching: isViewsFetching } =
        useGetReleaseRanking(
            {
                fromDate: effectiveFromDate,
                toDate: effectiveToDate,
                page,
                pageSize,
                keyword: dataFilter.keyword,
                groupBySource: true,
                releaseType: requestReleaseType,
                releaseId,
                ...scopeParams,
            },
            { enabled: enabled && !isRevenue }
        );

    // Fetch revenue ranking data
    const { topReleaseData, isFetching: isRevenueFetching } =
        useGetRevenueTopRelease(
            {
                fromDate: effectiveFromDate,
                toDate: effectiveToDate,
                page,
                pageSize,
                keyword: dataFilter.keyword,
                includeOther: false,
                sortBy: revenueSortBy,
                groupBySource: true,
                releaseType: requestReleaseType,
                releaseId,
                ...scopeParams,
            },
            { enabled: enabled && isRevenue }
        );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const revenueColumns: ProColumns<RevenueReleaseItem>[] = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
            align: 'center' as const,
            fixed: fixedLeft,
            render: (_, record: RevenueReleaseItem) => (
                <Typography.Text type="secondary">
                    #{record.rank}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.release'),
            dataIndex: 'title',
            key: 'title',
            width: 350,
            ellipsis: true,
            fixed: fixedLeft,
            render: (_, record: RevenueReleaseItem) => (
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
                                    // setActiveDetail({
                                    //     type: 'release',
                                    //     title: record.title,
                                    //     targetId: record.releaseId,
                                    // });
                                    onSelectEntity?.({
                                        id: record.releaseId,
                                        title: record.title,
                                        type: ANALYTICS_ENTITY_TYPE.RELEASE,
                                        thumbnailUrl: record.release
                                            ?.coverArtThumbnails?.[
                                            RELEASE_COVER_ART_SIZE.S75
                                        ] as string,
                                    });
                                }}
                            >
                                {record.title}
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
            render: (_, record: RevenueReleaseItem) => (
                <Typography.Text type="secondary" className="truncate">
                    {record.upc || '-'}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: 180,
            ellipsis: true,
            render: (_, record: RevenueReleaseItem) => {
                if (!record.labelId) {
                    return (
                        <Typography.Text className="truncate">
                            {record.labelName || '-'}
                        </Typography.Text>
                    );
                }
                return (
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <Typography.Text
                            className="cursor-pointer transition-colors hover:text-blue-500"
                            onClick={() => {
                                // setActiveDetail({
                                //     type: 'label',
                                //     title: record.labelName,
                                //     targetId: record.labelId,
                                // });
                                onSelectEntity?.({
                                    id: record.labelId,
                                    title: record.labelName,
                                    type: ANALYTICS_ENTITY_TYPE.LABEL,
                                });
                            }}
                        >
                            {record.labelName || '-'}
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
                                    // setActiveDetail({
                                    //     type: 'tenant',
                                    //     title: workspaceName || '',
                                    //     targetId: workspace?.id,
                                    // });
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
            title: messages('common.onlineLink'),
            key: 'onlineLink',
            width: 150,
            render: (_, record: RevenueReleaseItem) => {
                const metadataExternal = record?.metadataExternal;
                if (!metadataExternal) return '-';
                const entries = Object.entries(metadataExternal).filter(
                    ([, metadata]) => !!metadata?.albumUrl
                );
                if (entries.length === 0) return '-';
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
            render: (_, record: RevenueReleaseItem) => {
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
                                        // setActiveDetail({
                                        //     type: 'source',
                                        //     title: item.sourceLabel,
                                        //     targetId: item.source,
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
            render: (_, record: RevenueReleaseItem) => (
                <Typography.Text type="secondary">
                    {record.trackCount || 0}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.usage'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: 140,
            fixed: fixedRight,
            render: (_, record: RevenueReleaseItem) => (
                <Typography.Text type="secondary">
                    {record.quantity ? record.quantity.toLocaleString() : 0}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.revenue'),
            dataIndex: 'revenueUsd',
            key: 'revenueUsd',
            width: 150,
            fixed: fixedRight,
            render: (_, record: RevenueReleaseItem) => (
                <Typography.Text>
                    $
                    {record.revenueUsd
                        ? formattedNumber(record.revenueUsd)
                        : '0.00'}
                </Typography.Text>
            ),
        },
    ];

    const viewColumns: ProColumns<ReleaseRankingItem>[] = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
            align: 'center' as const,
            fixed: fixedLeft,
            render: (_, record: ReleaseRankingItem) => (
                <Typography.Text type="secondary">
                    #{record.rank}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.release'),
            dataIndex: 'title',
            key: 'title',
            width: 350,
            ellipsis: true,
            fixed: fixedLeft,
            render: (_, record: ReleaseRankingItem) => (
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
                                    // setActiveDetail({
                                    //     type: 'release',
                                    //     title: record.title,
                                    //     targetId: record.releaseId,
                                    // });
                                    onSelectEntity?.({
                                        id: record.releaseId,
                                        title: record.title,
                                        type: ANALYTICS_ENTITY_TYPE.RELEASE,
                                        thumbnailUrl: record.release
                                            ?.coverArtThumbnails?.[
                                            RELEASE_COVER_ART_SIZE.S75
                                        ] as string,
                                    });
                                }}
                            >
                                {record.title}
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
            render: (_, record: ReleaseRankingItem) => (
                <Typography.Text type="secondary" className="truncate">
                    {record.upc || '-'}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: 180,
            ellipsis: true,
            render: (_, record: ReleaseRankingItem) => {
                if (!record.labelId) {
                    return (
                        <Typography.Text className="truncate">
                            {record.labelName || '-'}
                        </Typography.Text>
                    );
                }
                return (
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <Typography.Text
                            className="cursor-pointer transition-colors hover:text-blue-500"
                            onClick={() => {
                                // setActiveDetail({
                                //     type: 'label',
                                //     title: record.labelName,
                                //     targetId: record.labelId,
                                // });
                                onSelectEntity?.({
                                    id: record.labelId,
                                    title: record.labelName,
                                    type: ANALYTICS_ENTITY_TYPE.LABEL,
                                });
                            }}
                        >
                            {record.labelName || '-'}
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
                                onClick={() => {
                                    // setActiveDetail({
                                    //     type: 'tenant',
                                    //     title: workspaceName || '',
                                    //     targetId: tenantId,
                                    // });
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
            title: messages('common.onlineLink'),
            key: 'onlineLink',
            width: 150,
            render: (_, record: ReleaseRankingItem) => {
                const metadataExternal = record?.metadataExternal;
                if (!metadataExternal) return '-';
                const entries = Object.entries(metadataExternal).filter(
                    ([, metadata]) => !!metadata?.albumUrl
                );
                if (entries.length === 0) return '-';
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
            width: 200,
            render: (_, record: ReleaseRankingItem) => {
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
                                        // setActiveDetail({
                                        //     type: 'source',
                                        //     title: item.sourceLabel,
                                        //     targetId: item.source,
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
            render: (_, record: ReleaseRankingItem) => (
                <Typography.Text type="secondary">
                    {record.trackCount || 0}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.streams'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 150,
            fixed: fixedRight,
            render: (_, record: ReleaseRankingItem) => (
                <Typography.Text>
                    {record.totalViews ? record.totalViews.toLocaleString() : 0}
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
                    <AppProTable<RevenueReleaseItem>
                        key={isMobile ? 'mobile' : 'desktop'}
                        options={false}
                        sticky
                        size="small"
                        columns={revenueColumns}
                        dataSource={topReleaseData.items}
                        loading={isFetching}
                        rowKey="releaseId"
                        pagination={false}
                        search={false}
                        scroll={{ x: SCREEN.LG }}
                    />
                ) : (
                    <AppProTable<ReleaseRankingItem>
                        key={isMobile ? 'mobile' : 'desktop'}
                        options={false}
                        sticky
                        size="small"
                        columns={viewColumns}
                        dataSource={releaseRankingData.items}
                        loading={isFetching}
                        rowKey="releaseId"
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
                            ? topReleaseData?.metadata?.totalItems || 0
                            : releaseRankingData?.metadata?.totalItems || 0
                    }
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />
            </Card>
        </>
    );
}
