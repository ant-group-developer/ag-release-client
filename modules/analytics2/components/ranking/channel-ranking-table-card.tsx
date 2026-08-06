'use client';

import ImageFallback from '@/components/ui/image/image-fallback';
import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import AppProTable from '@/components/ui/table/pro-table';
import PopoverTagsV2 from '@/components/ui/tag/popover-tags-v2';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
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
import { useGetChannelRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopChannel } from '@/modules/analytics2/hooks/use-get-revenue-data';
import {
    BySourceItem,
    ChannelRankingItem,
    RevenueChannelItem,
    TenantInfo,
} from '@/modules/analytics2/types';
import { CommonParams } from '@/types/api';
import type { ProColumns } from '@ant-design/pro-components';
import { Card, Segmented, Tag, Tooltip, Typography } from 'antd';
import { Columns3 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const DEFAULT_PAGE = 1;

export interface ChannelRankingTableCardProps {
    channelId?: string;
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

export default function ChannelRankingTableCard({
    channelId,
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
}: ChannelRankingTableCardProps) {
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

    const { channelRankingData, isFetching: isViewsFetching } =
        useGetChannelRanking(
            {
                fromDate: effectiveFromDate,
                toDate: effectiveToDate,
                page,
                pageSize,
                keyword: dataFilter.keyword,
                groupBySource: true,
                releaseType: requestReleaseType,
                channelId,
                ...scopeParams,
            },
            { enabled: enabled && !isRevenue }
        );

    const { topChannelData, isFetching: isRevenueFetching } =
        useGetRevenueTopChannel(
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
                channelId,
                ...scopeParams,
            },
            { enabled: enabled && isRevenue }
        );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const handleSelectChannel = (
        id: string,
        title: string,
        thumbnailUrl?: string | null
    ) => {
        onSelectEntity?.({
            id,
            title,
            type: ANALYTICS_ENTITY_TYPE.CHANNEL,
            thumbnailUrl: thumbnailUrl || undefined,
        });
    };

    const handleSelectTenant = (tenant: TenantInfo) => {
        onSelectEntity?.({
            id: tenant.id,
            title: tenant.name || '',
            type: ANALYTICS_ENTITY_TYPE.WORKSPACE,
            thumbnailUrl: tenant.logo || undefined,
        });
    };

    const handleSelectSource = (item: BySourceItem) => {
        onSelectEntity?.({
            id: item.source,
            title: item.sourceLabel,
            type: ANALYTICS_ENTITY_TYPE.SOURCE_TYPE,
        });
    };

    const renderChannelName = (
        text: string,
        record: ChannelRankingItem | RevenueChannelItem
    ) => (
        <div className="flex items-center gap-3">
            <ImageFallback
                src={record.thumbUrl ?? ''}
                alt={text}
                width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                className="aspect-square rounded-full object-cover"
            />
            <div className="flex min-w-0 flex-col">
                <CustomTooltip title={messages('common.detailedAnalysis')}>
                    <Typography.Text
                        className="cursor-pointer truncate transition-colors hover:text-blue-500"
                        onClick={() =>
                            handleSelectChannel(
                                record.channelId,
                                text,
                                record.thumbUrl
                            )
                        }
                    >
                        {text || '-'}
                    </Typography.Text>
                </CustomTooltip>
            </div>
        </div>
    );

    const renderYoutubeChannelId = (value?: string) => {
        if (!value) return '-';
        return (
            <div className="flex items-center gap-1">
                <Tooltip title={messages('common.viewOnYoutube')}>
                    <a
                        href={`https://www.youtube.com/channel/${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-blue-500 hover:underline"
                    >
                        {value}
                    </a>
                </Tooltip>
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

    const renderTenant = (tenant?: TenantInfo | null) => {
        if (!tenant) return '-';
        return (
            <div className="flex items-center gap-3">
                <ImageFallback
                    src={tenant.logo ?? ''}
                    alt={tenant.name ?? ''}
                    width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                    height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                    className="aspect-square rounded-full object-cover"
                />
                <CustomTooltip title={messages('common.detailedAnalysis')}>
                    <Typography.Text
                        className="cursor-pointer truncate transition-colors hover:text-blue-500"
                        onClick={() => handleSelectTenant(tenant)}
                    >
                        {tenant.name || '-'}
                    </Typography.Text>
                </CustomTooltip>
            </div>
        );
    };

    const renderBySource = (bySource?: BySourceItem[], revenue = false) => {
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
                            onClick={() => handleSelectSource(item)}
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

    const revenueColumns: ProColumns<RevenueChannelItem>[] = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
            align: 'center' as const,
            fixed: 'left',
            render: (_, record: RevenueChannelItem) => (
                <Typography.Text type="secondary">
                    #{record.rank}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.channel'),
            dataIndex: 'channelName',
            key: 'channelName',
            width: 260,
            ellipsis: true,
            fixed: 'left',
            render: (_, record: RevenueChannelItem) =>
                renderChannelName(record.channelName, record),
        },
        {
            title: messages('common.youtubeChannelId'),
            dataIndex: 'youtubeChannelId',
            key: 'youtubeChannelId',
            width: 240,
            ellipsis: true,
            render: (_, record: RevenueChannelItem) =>
                renderYoutubeChannelId(record.youtubeChannelId),
        },
        {
            title: messages('tenant.label'),
            dataIndex: 'tenant',
            key: 'tenant',
            width: 240,
            ellipsis: true,
            render: (_, record: RevenueChannelItem) =>
                renderTenant(record.tenant),
        },
        {
            title: messages('common.sourcePlatform'),
            dataIndex: 'bySource',
            key: 'bySource',
            width: 200,
            render: (_, record: RevenueChannelItem) =>
                renderBySource(record.bySource, true),
        },
        {
            title: messages('common.usage'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: 150,
            fixed: 'right',
            render: (_, record: RevenueChannelItem) => (
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
            fixed: 'right',
            render: (_, record: RevenueChannelItem) => (
                <Typography.Text>
                    $
                    {record.revenueUsd
                        ? formattedNumber(record.revenueUsd)
                        : '0.00'}
                </Typography.Text>
            ),
        },
    ];

    const viewColumns: ProColumns<ChannelRankingItem>[] = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
            align: 'center' as const,
            fixed: 'left',
            render: (_, record: ChannelRankingItem) => (
                <Typography.Text type="secondary">
                    #{record.rank}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.channel'),
            dataIndex: 'channelName',
            key: 'channelName',
            width: 260,
            ellipsis: true,
            fixed: 'left',
            render: (_, record: ChannelRankingItem) =>
                renderChannelName(record.channelName, record),
        },
        {
            title: messages('common.youtubeChannelId'),
            dataIndex: 'youtubeChannelId',
            key: 'youtubeChannelId',
            width: 240,
            ellipsis: true,
            render: (_, record: ChannelRankingItem) =>
                renderYoutubeChannelId(record.youtubeChannelId),
        },
        {
            title: messages('tenant.label'),
            dataIndex: 'tenant',
            key: 'tenant',
            width: 240,
            ellipsis: true,
            render: (_, record: ChannelRankingItem) =>
                renderTenant(record.tenant),
        },
        {
            title: messages('common.sourcePlatform'),
            dataIndex: 'bySource',
            key: 'bySource',
            width: 200,
            render: (_, record: ChannelRankingItem) =>
                renderBySource(record.bySource),
        },
        {
            title: messages('common.streams'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 150,
            fixed: 'right',
            render: (_, record: ChannelRankingItem) => (
                <Typography.Text>
                    {record.totalViews ? record.totalViews.toLocaleString() : 0}
                </Typography.Text>
            ),
        },
    ];

    const toolbarConfig = {
        search: (
            <AppSearch
                onChange={onSearch}
                defaultValue={dataFilter.keyword}
                style={{ width: 200 }}
            />
        ),
        actions: [
            <Segmented
                key="releaseType"
                value={selectedReleaseType}
                onChange={(value) => {
                    const selectedType = value as ANALYTICS_RELEASE_TYPE;
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
            />,
            <Segmented
                key="metricType"
                value={
                    isRevenue
                        ? ANALYTICS_VIEW_TYPE.REVENUE
                        : ANALYTICS_VIEW_TYPE.VIEW
                }
                onChange={(value) => {
                    const nextType = value as ANALYTICS_VIEW_TYPE;
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
            />,
        ],
    };

    return (
        <Card className={className}>
            {isRevenue ? (
                <AppProTable<RevenueChannelItem>
                    className="[&_.ant-pro-table-list-toolbar-container]:!px-0 [&_.ant-pro-table-list-toolbar-container]:!pt-0"
                    toolbar={toolbarConfig}
                    sticky
                    size="small"
                    columns={revenueColumns}
                    dataSource={topChannelData.items}
                    loading={isFetching}
                    rowKey="channelId"
                    pagination={false}
                    search={false}
                    options={{
                        setting: {
                            settingIcon: <Columns3 size={SIZE_ICON} />,
                        },
                        density: false,
                        fullScreen: false,
                        reload: false,
                    }}
                    scroll={{ x: SCREEN.LG }}
                />
            ) : (
                <AppProTable<ChannelRankingItem>
                    className="[&_.ant-pro-table-list-toolbar-container]:!px-0 [&_.ant-pro-table-list-toolbar-container]:!pt-0"
                    toolbar={toolbarConfig}
                    sticky
                    size="small"
                    columns={viewColumns}
                    dataSource={channelRankingData.items}
                    loading={isFetching}
                    rowKey="channelId"
                    pagination={false}
                    search={false}
                    options={{
                        setting: {
                            settingIcon: <Columns3 size={SIZE_ICON} />,
                        },
                        density: false,
                        fullScreen: false,
                        reload: false,
                    }}
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
                        ? topChannelData?.metadata?.totalItems || 0
                        : channelRankingData?.metadata?.totalItems || 0
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

