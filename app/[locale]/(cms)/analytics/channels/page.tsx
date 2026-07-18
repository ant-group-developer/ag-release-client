'use client';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import DateSelect2 from '@/components/ui/select/date-select2';
import PopoverTagsV2 from '@/components/ui/tag/popover-tags-v2';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { APP_ROUTES } from '@/enums/routes';
import { formattedNumber } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import DetailChannelAnalyticsModal from '@/modules/analytics2/components/detail-channel/detail-channel-analytics-modal';
import DetailSourceTypeAnalyticsModal from '@/modules/analytics2/components/detail-source-type/detail-source-type-analytics-modal';
import DetailTenantAnalyticsModal from '@/modules/analytics2/components/detail-tenant/detail-tenant-analytics-modal';
import {
    ANALYTICS_RANKING_THUMBNAIL_SIZE,
    RANK_COLUMN_WIDTH,
    ANALYTICS_DEFAULT_START_DATE,
    ANALYTICS_DEFAULT_END_DATE,
} from '@/modules/analytics2/constants/types';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import {
    getAnalyticsViewType,
} from '@/modules/analytics2/helpers';
import { useGetChannelRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopChannel } from '@/modules/analytics2/hooks/use-get-revenue-data';
import {
    ChannelRankingItem,
    RevenueChannelItem,
} from '@/modules/analytics2/types';
import { CommonParams } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Segmented, Table, Tag, theme, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const DEFAULT_PAGE = 1;

interface RankingFilter extends CommonParams {
    startDate?: string;
    endDate?: string;
    type?: ANALYTICS_VIEW_TYPE;
}

export default function ChannelsRankingPage() {
    const { token } = theme.useToken();
    const messages = useTranslations();
    const searchParams = useSearchParams();

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<RankingFilter>({
            page: DEFAULT_PAGE,
            pageSize: PAGE_SIZE_DEFAULT,
            startDate:
                searchParams.get('fromDate') || ANALYTICS_DEFAULT_START_DATE,
            endDate:
                searchParams.get('toDate') || ANALYTICS_DEFAULT_END_DATE,
            type: getAnalyticsViewType(searchParams.get('type')),
        });

    const [currentType, setCurrentType] = useState<ANALYTICS_VIEW_TYPE>(() =>
        getAnalyticsViewType(searchParams.get('type'))
    );

    useEffect(() => {
        setCurrentType(getAnalyticsViewType(searchParams.get('type')));
    }, [searchParams]);

    const [activeDetail, setActiveDetail] = useState<{
        type: 'channel' | 'source' | 'workspace' | null;
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

    // Fetch ranking data (Views)
    const { channelRankingData, isFetching: isViewsFetching } =
        useGetChannelRanking(
            {
                fromDate: dataFilter.startDate!,
                toDate: dataFilter.endDate!,
                page,
                pageSize,
                keyword: dataFilter.keyword,
                groupBySource: true,
            },
            { enabled: !isRevenue }
        );

    // Fetch revenue ranking data
    const { topChannelData, isFetching: isRevenueFetching } =
        useGetRevenueTopChannel(
            {
                fromDate: dataFilter.startDate!,
                toDate: dataFilter.endDate!,
                page,
                pageSize,
                keyword: dataFilter.keyword,
                includeOther: false,
                groupBySource: true,
            },
            { enabled: isRevenue }
        );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const revenueColumns: ColumnsType<RevenueChannelItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: RANK_COLUMN_WIDTH,
            align: 'center' as const,
            render: (rank: number) => (
                <span className="text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('common.channel'),
            dataIndex: 'channelName',
            key: 'channelName',
            width: 260,
            ellipsis: true,
            render: (text: string, record: RevenueChannelItem) => (
                <div className="flex items-center gap-3">
                    <ImageFallback
                        src={record.thumbUrl ?? ''}
                        alt={text}
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        className="aspect-square rounded-full object-cover"
                    />
                    <div className="flex min-w-0 flex-col">
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <Typography.Text
                                className="cursor-pointer truncate transition-colors hover:text-blue-500"
                                onClick={() =>
                                    setActiveDetail({
                                        type: 'channel',
                                        title: text,
                                        targetId: record.channelId,
                                    })
                                }
                            >
                                {text || '-'}
                            </Typography.Text>
                        </CustomTooltip>
                    </div>
                </div>
            ),
        },
        {
            title: messages('common.youtubeChannelId'),
            dataIndex: 'youtubeChannelId',
            key: 'youtubeChannelId',
            width: 240,
            ellipsis: true,
            render: (value: string) => {
                if (!value) return '—';
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
                                copyable={{
                                    text: value,
                                    tooltips: false,
                                }}
                            />
                        </span>
                    </div>
                );
            },
        },
        {
            title: messages('tenant.label'),
            dataIndex: 'tenant',
            key: 'tenant',
            width: 240,
            ellipsis: true,
            render: (tenant: any) => {
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
                                onClick={() =>
                                    setActiveDetail({
                                        type: 'workspace',
                                        title: tenant.name || '',
                                        targetId: tenant.id,
                                    })
                                }
                            >
                                {tenant.name || '—'}
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
                        maxVisibleTags={2}
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
            title: messages('common.usage'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: 180,
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
                    ${val ? formattedNumber(val) : '0.00'}
                </span>
            ),
        },
    ];

    const viewColumns: ColumnsType<ChannelRankingItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: RANK_COLUMN_WIDTH,
            align: 'center' as const,
            render: (rank: number) => (
                <span className="text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('common.channel'),
            dataIndex: 'channelName',
            key: 'channelName',
            width: 260,
            ellipsis: true,
            render: (text: string, record: ChannelRankingItem) => (
                <div className="flex items-center gap-3">
                    <ImageFallback
                        src={record.thumbUrl ?? ''}
                        alt={text}
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        className="aspect-square rounded-full object-cover"
                    />
                    <div className="flex min-w-0 flex-col">
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <Typography.Text
                                className="cursor-pointer truncate transition-colors hover:text-blue-500"
                                onClick={() =>
                                    setActiveDetail({
                                        type: 'channel',
                                        title: text,
                                        targetId: record.channelId,
                                    })
                                }
                            >
                                {text || '-'}
                            </Typography.Text>
                        </CustomTooltip>
                    </div>
                </div>
            ),
        },
        {
            title: messages('common.youtubeChannelId'),
            dataIndex: 'youtubeChannelId',
            key: 'youtubeChannelId',
            width: 240,
            ellipsis: true,
            render: (value: string) => {
                if (!value) return '—';
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
                                copyable={{
                                    text: value,
                                    tooltips: false,
                                }}
                            />
                        </span>
                    </div>
                );
            },
        },
        {
            title: messages('tenant.label'),
            dataIndex: 'tenant',
            key: 'tenant',
            width: 240,
            ellipsis: true,
            render: (tenant: any) => {
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
                                onClick={() =>
                                    setActiveDetail({
                                        type: 'workspace',
                                        title: tenant.name || '',
                                        targetId: tenant.id,
                                    })
                                }
                            >
                                {tenant.name || '—'}
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
                        maxVisibleTags={2}
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
        ? `${messages('common.channel')} - ${messages('common.revenue')}`
        : `${messages('common.channel')} - ${messages('common.views')}`;

    const breadcrumbs = [
        {
            title: messages('analytics.label'),
            href: APP_ROUTES.ANALYTICS,
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
                    <div className="mb-4 flex items-center gap-2">
                        <AppSearch
                            onChange={onSearch}
                            defaultValue={dataFilter.keyword}
                            style={{ width: 200 }}
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
                        <Table<RevenueChannelItem>
                            sticky
                            columns={revenueColumns}
                            dataSource={topChannelData.items}
                            loading={isFetching}
                            rowKey="channelId"
                            size="small"
                            pagination={false}
                            scroll={{ x: 'max-content' }}
                        />
                    ) : (
                        <Table<ChannelRankingItem>
                            sticky
                            columns={viewColumns}
                            dataSource={channelRankingData.items}
                            loading={isFetching}
                            rowKey="channelId"
                            size="small"
                            pagination={false}
                            scroll={{ x: 'max-content' }}
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

                {activeDetail.type === 'channel' && (
                    <DetailChannelAnalyticsModal
                        open={true}
                        onClose={() =>
                            setActiveDetail((prev) => ({
                                ...prev,
                                type: null,
                            }))
                        }
                        title={activeDetail.title}
                        channelId={activeDetail.targetId}
                        fromDate={dataFilter.startDate!}
                        toDate={dataFilter.endDate!}
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
                        fromDate={dataFilter.startDate!}
                        toDate={dataFilter.endDate!}
                    />
                )}

                {activeDetail.type === 'workspace' && (
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
                        fromDate={dataFilter.startDate!}
                        toDate={dataFilter.endDate!}
                    />
                )}
            </PageContainer>
        </div>
    );
}
