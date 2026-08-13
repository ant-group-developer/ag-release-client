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
    getAnalyticsViewType,
    type AnalyticsScopeParams,
} from '@/modules/analytics2/helpers';
import { useGetReleaseVideoRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopReleaseVideo } from '@/modules/analytics2/hooks/use-get-revenue-data';
import {
    BySourceItem,
    ReleaseVideoRankingItem,
    RevenueReleaseVideoItem,
} from '@/modules/analytics2/types';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { CommonParams } from '@/types/api';
import type { ProColumns } from '@ant-design/pro-components';
import { Card, Grid, Tag, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import RankingTableFilter from './ranking-table-filter';

const DEFAULT_PAGE = 1;

type ReleaseVideoRow = ReleaseVideoRankingItem | RevenueReleaseVideoItem;

interface WorkspaceCell {
    id: string;
    name?: string;
    logo?: string | null;
}

interface ChannelCell {
    id: string;
    name?: string;
    youtubeChannelId?: string;
}

export interface ReleaseVideoRankingTableCardProps {
    releaseId?: string;
    scopeParams?: AnalyticsScopeParams;
    fromDate?: string;
    toDate?: string;
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
}

export default function ReleaseVideoRankingTableCard({
    releaseId,
    scopeParams,
    fromDate,
    toDate,
    metricKey,
    onMetricChange,
    onSelectEntity,
    enabled = true,
    className = 'rounded-xl border-none shadow-sm',
    paramPrefix,
}: ReleaseVideoRankingTableCardProps) {
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
            },
            { paramPrefix, history: paramPrefix ? 'replace' : 'push' }
        );

    const [currentType, setCurrentType] = useState<ANALYTICS_VIEW_TYPE>(() =>
        getAnalyticsViewType(dataFilter.type ?? null)
    );

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

    const { releaseVideoRankingData, isFetching: isViewsFetching } =
        useGetReleaseVideoRanking(
            {
                fromDate: effectiveFromDate,
                toDate: effectiveToDate,
                page,
                pageSize,
                keyword: dataFilter.keyword,
                groupBySource: true,
                releaseType: ANALYTICS_RELEASE_TYPE.VIDEO,
                releaseId,
                ...scopeParams,
            },
            { enabled: enabled && !isRevenue }
        );

    const { topReleaseVideoData, isFetching: isRevenueFetching } =
        useGetRevenueTopReleaseVideo(
            {
                fromDate: effectiveFromDate,
                toDate: effectiveToDate,
                page,
                pageSize,
                keyword: dataFilter.keyword,
                includeOther: false,
                sortBy: revenueSortBy,
                groupBySource: true,
                releaseType: ANALYTICS_RELEASE_TYPE.VIDEO,
                releaseId,
                ...scopeParams,
            },
            { enabled: enabled && isRevenue }
        );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const renderRank = (rank: number) => (
        <Typography.Text type="secondary">#{rank}</Typography.Text>
    );

    const renderTitle = (text: string, record: ReleaseVideoRow) => (
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
            <div className="flex min-w-0 flex-col">
                <CustomTooltip title={messages('common.detailedAnalysis')}>
                    <Typography.Text
                        className="cursor-pointer truncate transition-colors hover:text-blue-500"
                        onClick={() =>
                            onSelectEntity?.({
                                id: record.releaseId,
                                title: text,
                                type: ANALYTICS_ENTITY_TYPE.RELEASE_VIDEO,
                                thumbnailUrl: record.release
                                    ?.coverArtThumbnails?.[
                                    RELEASE_COVER_ART_SIZE.S75
                                ] as string,
                            })
                        }
                    >
                        {text || '-'}
                    </Typography.Text>
                </CustomTooltip>
            </div>
        </div>
    );

    const renderIsrc = (_: unknown, record: ReleaseVideoRow) => (
        <Typography.Text type="secondary" className="truncate">
            {record.video?.isrc || record.upc || '-'}
        </Typography.Text>
    );

    const renderLabel = (text: string, record: ReleaseVideoRow) => {
        const labelId = record.labelId;
        const labelName = text || record.video?.label || '-';
        if (!labelId) {
            return (
                <Typography.Text className="truncate">
                    {labelName}
                </Typography.Text>
            );
        }
        return (
            <CustomTooltip title={messages('common.detailedAnalysis')}>
                <Typography.Text
                    className="cursor-pointer transition-colors hover:text-blue-500"
                    onClick={() =>
                        onSelectEntity?.({
                            id: labelId,
                            title: labelName,
                            type: ANALYTICS_ENTITY_TYPE.LABEL,
                        })
                    }
                >
                    {labelName}
                </Typography.Text>
            </CustomTooltip>
        );
    };

    const renderWorkspaces = (workspaces?: WorkspaceCell[]) => {
        if (!workspaces?.length) return '-';
        return (
            <div className="flex flex-col gap-2">
                {workspaces.map((workspace) => (
                    <div key={workspace.id} className="flex items-center gap-2">
                        <ReleaseCoverImage
                            width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                            height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                            src={workspace.logo}
                        />
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <Typography.Text
                                className="cursor-pointer transition-colors hover:text-blue-500"
                                onClick={() =>
                                    onSelectEntity?.({
                                        id: workspace.id,
                                        title: workspace.name || '',
                                        type: ANALYTICS_ENTITY_TYPE.WORKSPACE,
                                        thumbnailUrl:
                                            workspace.logo || undefined,
                                    })
                                }
                            >
                                {workspace.name || '-'}
                            </Typography.Text>
                        </CustomTooltip>
                    </div>
                ))}
            </div>
        );
    };

    const renderChannels = (channels?: ChannelCell[]) => {
        if (!channels?.length) return '-';
        return (
            <div className="flex flex-col items-start gap-1">
                {channels.map((channel) => (
                    <CustomTooltip
                        key={channel.id}
                        title={messages('common.detailedAnalysis')}
                    >
                        <Typography.Text
                            className="cursor-pointer truncate transition-colors hover:text-blue-500"
                            onClick={() =>
                                onSelectEntity?.({
                                    id: channel.id,
                                    title: channel.name || '',
                                    type: ANALYTICS_ENTITY_TYPE.CHANNEL,
                                })
                            }
                        >
                            {channel.name || '-'}
                        </Typography.Text>
                    </CustomTooltip>
                ))}
            </div>
        );
    };

    const renderYoutubeId = (_: unknown, record: ReleaseVideoRow) => {
        const value = record.video?.externalId;
        if (!value) return '-';
        return (
            <div className="flex w-fit items-center gap-1">
                <CustomTooltip title={messages('common.viewOnYoutube')}>
                    <a
                        href={`https://www.youtube.com/watch?v=${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block max-w-full truncate text-blue-500 hover:underline"
                    >
                        {value}
                    </a>
                </CustomTooltip>
                <span
                    className="inline-block align-middle"
                    data-stop-row-click="true"
                >
                    <Typography.Text
                        copyable={{ text: value, tooltips: false }}
                    />
                </span>
            </div>
        );
    };

    const renderBySource = (bySource?: BySourceItem[], revenue = false) => {
        if (!bySource?.length) return '-';
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
                                onSelectEntity?.({
                                    id: item.source,
                                    title: item.sourceLabel,
                                    type: ANALYTICS_ENTITY_TYPE.SOURCE_TYPE,
                                })
                            }
                        >
                            {item.sourceLabel}:{' '}
                            {revenue
                                ? `$${formattedNumber(item.revenueUsd)}`
                                : formattedNumber(item.quantity)}
                        </Tag>
                    </CustomTooltip>
                )}
            />
        );
    };

    const revenueColumns: ProColumns<RevenueReleaseVideoItem>[] = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
            align: 'center' as const,
            fixed: fixedLeft,
            render: (_, record: RevenueReleaseVideoItem) =>
                renderRank(record.rank),
        },
        {
            title: messages('common.releasesVideo'),
            dataIndex: 'title',
            key: 'title',
            width: 300,
            ellipsis: true,
            fixed: fixedLeft,
            render: (_, record: RevenueReleaseVideoItem) =>
                renderTitle(record.title, record),
        },
        {
            title: 'ISRC',
            key: 'isrc',
            width: 140,
            ellipsis: true,
            render: renderIsrc,
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: 140,
            ellipsis: true,
            render: (_, record: RevenueReleaseVideoItem) =>
                renderLabel(record.labelName, record),
        },
        {
            title: messages('common.workspace'),
            dataIndex: 'workspaces',
            key: 'workspaces',
            width: 180,
            ellipsis: true,
            render: (_, record: RevenueReleaseVideoItem) =>
                renderWorkspaces(record.workspaces),
        },
        {
            title: messages('common.channel'),
            dataIndex: 'channels',
            key: 'channels',
            width: 180,
            ellipsis: true,
            render: (_, record: RevenueReleaseVideoItem) =>
                renderChannels(record.channels),
        },
        {
            title: messages('common.youtubeId'),
            key: 'youtubeId',
            width: 140,
            ellipsis: true,
            render: renderYoutubeId,
        },
        {
            title: messages('common.sourcePlatform'),
            dataIndex: 'bySource',
            key: 'bySource',
            width: 150,
            render: (bySource: any) => renderBySource(bySource, true),
        },
        {
            title: messages('common.usage'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: 120,
            fixed: fixedRight,
            render: (_, record: RevenueReleaseVideoItem) => (
                <Typography.Text type="secondary">
                    {record.quantity ? record.quantity.toLocaleString() : 0}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.revenue'),
            dataIndex: 'revenueUsd',
            key: 'revenueUsd',
            width: 120,
            fixed: fixedRight,
            render: (_, record: RevenueReleaseVideoItem) => (
                <Typography.Text>
                    $
                    {record.revenueUsd
                        ? formattedNumber(record.revenueUsd)
                        : '0.00'}
                </Typography.Text>
            ),
        },
    ];

    const viewColumns: ProColumns<ReleaseVideoRankingItem>[] = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
            align: 'center' as const,
            fixed: fixedLeft,
            render: (_, record: ReleaseVideoRankingItem) =>
                renderRank(record.rank),
        },
        {
            title: messages('common.releasesVideo'),
            dataIndex: 'title',
            key: 'title',
            width: 300,
            ellipsis: true,
            fixed: fixedLeft,
            render: (_, record: ReleaseVideoRankingItem) =>
                renderTitle(record.title, record),
        },
        {
            title: 'ISRC',
            key: 'isrc',
            width: 140,
            ellipsis: true,
            render: renderIsrc,
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: 140,
            ellipsis: true,
            render: (_, record: ReleaseVideoRankingItem) =>
                renderLabel(record.labelName, record),
        },
        {
            title: messages('common.workspace'),
            dataIndex: 'workspaces',
            key: 'workspaces',
            width: 180,
            ellipsis: true,
            render: (_, record: ReleaseVideoRankingItem) =>
                renderWorkspaces(record.workspaces),
        },
        {
            title: messages('common.channel'),
            dataIndex: 'channels',
            key: 'channels',
            width: 180,
            ellipsis: true,
            render: (_, record: ReleaseVideoRankingItem) =>
                renderChannels(record.channels),
        },
        {
            title: messages('common.youtubeId'),
            key: 'youtubeId',
            width: 140,
            ellipsis: true,
            render: renderYoutubeId,
        },
        {
            title: messages('common.sourcePlatform'),
            dataIndex: 'bySource',
            key: 'bySource',
            width: 150,
            render: (bySource: any) => renderBySource(bySource),
        },
        {
            title: messages('common.streams'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 120,
            fixed: fixedRight,
            render: (_, record: ReleaseVideoRankingItem) => (
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
                showReleaseType={false}
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
                <AppProTable<RevenueReleaseVideoItem>
                    key={isMobile ? 'mobile' : 'desktop'}
                    options={false}
                    sticky
                    size="small"
                    columns={revenueColumns}
                    dataSource={topReleaseVideoData.items}
                    loading={isFetching}
                    rowKey="youtubeVideoId"
                    pagination={false}
                    search={false}
                    scroll={{ x: SCREEN.LG }}
                />
            ) : (
                <AppProTable<ReleaseVideoRankingItem>
                    key={isMobile ? 'mobile' : 'desktop'}
                    options={false}
                    sticky
                    size="small"
                    columns={viewColumns}
                    dataSource={releaseVideoRankingData.items}
                    loading={isFetching}
                    rowKey="youtubeVideoId"
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
                        ? topReleaseVideoData?.metadata?.totalItems || 0
                        : releaseVideoRankingData?.metadata?.totalItems || 0
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
