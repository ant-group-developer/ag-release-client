'use client';

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
import DetailTrackAnalyticsModal from '@/modules/analytics2/components/detail-track/detail-track-analytics-modal';
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
import { useGetTrackRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopTrack } from '@/modules/analytics2/hooks/use-get-revenue-data';
import { RevenueTrackItem, TrackRankingItem } from '@/modules/analytics2/types';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { CommonParams } from '@/types/api';
import { Card, Segmented, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const DEFAULT_PAGE = 1;

export interface TrackRankingTableCardProps {
    trackId?: string;
    isrc?: string;
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

export default function TrackRankingTableCard({
    trackId,
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
}: TrackRankingTableCardProps) {
    const messages = useTranslations();

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

    const [activeDetail, setActiveDetail] = useState<{
        type: 'track' | 'source' | 'label' | null;
        title: string;
        targetId: string;
    }>({
        type: null,
        title: '',
        targetId: '',
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
    const { trackRankingData, isFetching: isViewsFetching } =
        useGetTrackRanking(
            {
                fromDate: effectiveFromDate,
                toDate: effectiveToDate,
                page,
                pageSize,
                keyword: dataFilter.keyword,
                groupBySource: true,
                releaseType: requestReleaseType,
                trackId: trackId,
                ...scopeParams,
            },
            { enabled: enabled && !isRevenue }
        );

    // Fetch revenue ranking data
    const { topTrackData, isFetching: isRevenueFetching } =
        useGetRevenueTopTrack(
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
                trackId: trackId,
                ...scopeParams,
            },
            { enabled: enabled && isRevenue }
        );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const revenueColumns: ColumnsType<RevenueTrackItem> = [
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
            title: messages('common.track'),
            dataIndex: 'title',
            key: 'title',
            width: 300,
            ellipsis: true,
            fixed: 'left',
            render: (text: string, record: RevenueTrackItem) => (
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
                    <div className="flex min-w-0 max-w-[300px] flex-col">
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <Typography.Text
                                className="cursor-pointer truncate transition-colors hover:text-blue-500"
                                onClick={() => {
                                    // setActiveDetail({
                                    //     type: 'track',
                                    //     title: text,
                                    //     targetId: record.isrc,
                                    // });
                                    onSelectEntity?.({
                                        id: record.isrc,
                                        title: text,
                                        type: ANALYTICS_ENTITY_TYPE.TRACK,
                                        thumbnailUrl: record.release
                                            ?.coverArtThumbnails?.[
                                            RELEASE_COVER_ART_SIZE.S75
                                        ] as string,
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
            title: 'ISRC',
            dataIndex: 'isrc',
            key: 'isrc',
            width: 150,
            ellipsis: true,
            render: (text: string) => (
                <Typography.Text type="secondary" className="truncate">
                    {text || '-'}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: 160,
            ellipsis: true,
            render: (text: string, record: RevenueTrackItem) => {
                const labelName = record?.labelName;
                if (!record.labelId) return '-';
                return (
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <Typography.Text
                            className="cursor-pointer transition-colors hover:text-blue-500"
                            onClick={() => {
                                // setActiveDetail({
                                //     type: 'label',
                                //     title: labelName || '',
                                //     targetId: record.labelId as string,
                                // });
                                onSelectEntity?.({
                                    id: record.labelId as string,
                                    title: labelName || '',
                                    type: ANALYTICS_ENTITY_TYPE.LABEL,
                                });
                            }}
                        >
                            {labelName || '-'}
                        </Typography.Text>
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('common.onlineLink'),
            key: 'onlineLink',
            width: 160,
            render: (_, record: RevenueTrackItem) => {
                const track = record.release?.tracks?.find(
                    (t) => t.isrc === record.isrc
                );
                const metadataExternalObj =
                    record.metadataExternal ||
                    track?.metadataExternal ||
                    record.release?.metadataExternal;

                if (!metadataExternalObj) return '-';
                const entries = Object.entries(metadataExternalObj).filter(
                    ([, metadata]: [string, any]) =>
                        !!metadata?.trackUrl || !!metadata?.albumUrl
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
                            const url =
                                metadata?.trackUrl || metadata?.albumUrl;
                            return (
                                <CustomTooltip
                                    key={key}
                                    title={messages('common.seeMore')}
                                >
                                    <a
                                        href={url}
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
            render: (bySource?: any[]) => {
                if (!bySource || bySource.length === 0) return '-';
                return (
                    <PopoverTagsV2
                        items={bySource}
                        maxVisibleTags={2}
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
            title: messages('common.usage'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: 120,
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
            width: 140,
            fixed: 'right',
            render: (val: number) => (
                <Typography.Text>
                    ${val ? formattedNumber(val) : '0.00'}
                </Typography.Text>
            ),
        },
    ];

    const viewColumns: ColumnsType<TrackRankingItem> = [
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
            title: messages('common.track'),
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            width: 300,
            fixed: 'left',
            render: (text: string, record: TrackRankingItem) => (
                <div className="flex items-center gap-3">
                    <ReleaseCoverImage
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        fileId={
                            record?.release?.coverArtThumbnails?.[
                                RELEASE_COVER_ART_SIZE.S75
                            ] as string
                        }
                    />
                    <div className="flex min-w-0 max-w-[300px] flex-col">
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <Typography.Text
                                className="cursor-pointer truncate transition-colors hover:text-blue-500"
                                onClick={() => {
                                    // setActiveDetail({
                                    //     type: 'track',
                                    //     title: text,
                                    //     targetId: record.isrc,
                                    // });
                                    onSelectEntity?.({
                                        id: record.isrc,
                                        title: text,
                                        type: ANALYTICS_ENTITY_TYPE.TRACK,
                                        thumbnailUrl: record.release
                                            ?.coverArtThumbnails?.[
                                            RELEASE_COVER_ART_SIZE.S75
                                        ] as string,
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
            title: 'ISRC',
            dataIndex: 'isrc',
            key: 'isrc',
            width: 150,
            ellipsis: true,
            render: (text: string) => (
                <Typography.Text type="secondary" className="truncate">
                    {text || '-'}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: 160,
            ellipsis: true,
            render: (text: string, record: TrackRankingItem) => {
                const labelName = text || record.release?.label?.name;
                const labelId = record.labelId || record.release?.label?.id;
                if (!labelId) {
                    return (
                        <Typography.Text className="truncate">
                            {labelName || '-'}
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
                                //     title: labelName || '',
                                //     targetId: labelId,
                                // });
                                onSelectEntity?.({
                                    id: labelId,
                                    title: labelName || '',
                                    type: ANALYTICS_ENTITY_TYPE.LABEL,
                                });
                            }}
                        >
                            {labelName || '-'}
                        </Typography.Text>
                    </CustomTooltip>
                );
            },
        },
        {
            title: messages('common.onlineLink'),
            key: 'onlineLink',
            width: 160,
            render: (_, record: TrackRankingItem) => {
                const metadataExternalObj = record.metadataExternal;

                if (!metadataExternalObj) return '-';
                const entries = Object.entries(metadataExternalObj).filter(
                    ([, metadata]: [string, any]) =>
                        !!metadata?.trackUrl || !!metadata?.albumUrl
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
                            const url =
                                metadata?.trackUrl || metadata?.albumUrl;
                            return (
                                <CustomTooltip
                                    key={key}
                                    title={messages('common.seeMore')}
                                >
                                    <a
                                        href={url}
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
            render: (bySource?: any[]) => {
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
            title: messages('common.streams'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 150,
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
                        value={
                            isRevenue
                                ? ANALYTICS_VIEW_TYPE.REVENUE
                                : ANALYTICS_VIEW_TYPE.VIEW
                        }
                        onChange={(value) => {
                            const nextType = value as ANALYTICS_VIEW_TYPE;
                            setCurrentType(nextType);
                            // The metric owns the view type when it is
                            // controlled; writing both params would race two
                            // URL updates built from the same stale snapshot.
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
                    <Table<RevenueTrackItem>
                        sticky
                        size="small"
                        columns={revenueColumns}
                        dataSource={topTrackData.items}
                        loading={isFetching}
                        rowKey="isrc"
                        pagination={false}
                        scroll={{ x: SCREEN.LG }}
                    />
                ) : (
                    <Table<TrackRankingItem>
                        sticky
                        size="small"
                        columns={viewColumns}
                        dataSource={trackRankingData.items}
                        loading={isFetching}
                        rowKey="isrc"
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
                            ? topTrackData?.metadata?.totalItems || 0
                            : trackRankingData?.metadata?.totalItems || 0
                    }
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />
            </Card>

            {activeDetail.type === 'track' && (
                <DetailTrackAnalyticsModal
                    open={true}
                    onClose={() =>
                        setActiveDetail((prev) => ({ ...prev, type: null }))
                    }
                    title={activeDetail.title}
                    isrc={activeDetail.targetId}
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

            {activeDetail.type === 'label' && (
                <DetailLabelAnalyticsModal
                    open={true}
                    onClose={() =>
                        setActiveDetail((prev) => ({
                            ...prev,
                            type: null,
                        }))
                    }
                    title={activeDetail.title}
                    labelId={activeDetail.targetId}
                    fromDate={effectiveFromDate}
                    toDate={effectiveToDate}
                    releaseType={requestReleaseType}
                />
            )}
        </>
    );
}
