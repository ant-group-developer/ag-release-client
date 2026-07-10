'use client';
import ImageFallback from '@/components/ui/image/image-fallback';
import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import DateSelect2 from '@/components/ui/select/date-select2';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { APP_ROUTES } from '@/enums/routes';
import { useFilter } from '@/hooks/use-filter';
import { formattedNumber } from '@/helpers/common';
import DetailChannelAnalyticsModal from '@/modules/analytics2/components/detail-channel/detail-channel-analytics-modal';
import DetailSourceTypeAnalyticsModal from '@/modules/analytics2/components/detail-source-type/detail-source-type-analytics-modal';
import {
    ANALYTICS_RANKING_THUMBNAIL_SIZE,
    RANK_COLUMN_WIDTH,
} from '@/modules/analytics2/constants/types';
import { ANALYTICS_RELEASE_TYPE } from '@/modules/analytics2/enums';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import {
    getAnalyticsReleaseType,
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
import { Card, Segmented, Table, Tag, theme } from 'antd';
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
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function ChannelsRankingPage() {
    const { token } = theme.useToken();
    const messages = useTranslations();
    const searchParams = useSearchParams();

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<RankingFilter>({
            page: DEFAULT_PAGE,
            pageSize: PAGE_SIZE_DEFAULT,
            startDate: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
            endDate: dayjs().format('YYYY-MM-DD'),
            type: ANALYTICS_VIEW_TYPE.VIEW,
            releaseType: ANALYTICS_RELEASE_TYPE.AUDIO,
        });

    const [currentType, setCurrentType] = useState<ANALYTICS_VIEW_TYPE>(
        ANALYTICS_VIEW_TYPE.VIEW
    );
    const [releaseType, setReleaseType] = useState<ANALYTICS_RELEASE_TYPE>(
        ANALYTICS_RELEASE_TYPE.AUDIO
    );

    useEffect(() => {
        setCurrentType(getAnalyticsViewType(searchParams.get('type')));
        setReleaseType(
            getAnalyticsReleaseType(searchParams.get('releaseType'))
        );
    }, [searchParams]);

    const [channelDetailModal, setChannelDetailModal] = useState<{
        open: boolean;
        title: string;
        channelId: string;
    }>({
        open: false,
        title: '',
        channelId: '',
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
                releaseType,
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
                releaseType,
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
                            <span
                                className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setChannelDetailModal({
                                        open: true,
                                        title: text,
                                        channelId: record.channelId,
                                    })
                                }
                            >
                                {text || '-'}
                            </span>
                        </CustomTooltip>
                    </div>
                </div>
            ),
        },
        {
            title: messages('tenant.label'),
            dataIndex: 'tenant',
            key: 'tenant',
            width: 400,
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
                        <span className="text-gray-900 dark:text-zinc-100">
                            {tenant.name || '-'}
                        </span>
                    </div>
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
                    <div className="flex flex-wrap gap-1.5">
                        {bySource.map((item) => (
                            <CustomTooltip
                                key={item.source}
                                title={messages('common.detailedAnalysis')}
                            >
                                <Tag
                                    className="m-0 cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500"
                                    onClick={() =>
                                        setDetailSourceModal({
                                            open: true,
                                            title: item.sourceLabel,
                                            sourceType: item.source,
                                        })
                                    }
                                >
                                    {item.sourceLabel}: ${formattedNumber(item.revenueUsd)}
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
            width: 250,
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
            width: 250,
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
                            <span
                                className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setChannelDetailModal({
                                        open: true,
                                        title: text,
                                        channelId: record.channelId,
                                    })
                                }
                            >
                                {text || '-'}
                            </span>
                        </CustomTooltip>
                    </div>
                </div>
            ),
        },
        {
            title: messages('tenant.label'),
            dataIndex: 'tenant',
            key: 'tenant',
            width: 500,
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
                        <span className="text-gray-900 dark:text-zinc-100">
                            {tenant.name || '-'}
                        </span>
                    </div>
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
                    <div className="flex flex-wrap gap-1.5">
                        {bySource.map((item) => (
                            <CustomTooltip
                                key={item.source}
                                title={messages('common.detailedAnalysis')}
                            >
                                <Tag
                                    className="m-0 cursor-pointer transition-colors hover:border-blue-500 hover:text-blue-500"
                                    onClick={() =>
                                        setDetailSourceModal({
                                            open: true,
                                            title: item.sourceLabel,
                                            sourceType: item.source,
                                        })
                                    }
                                >
                                    {item.sourceLabel}: {formattedNumber(item.quantity)}
                                </Tag>
                            </CustomTooltip>
                        ))}
                    </div>
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
                            value={releaseType}
                            onChange={(value) => {
                                setReleaseType(value as ANALYTICS_RELEASE_TYPE);
                                onChangeFilter({
                                    releaseType:
                                        value as ANALYTICS_RELEASE_TYPE,
                                });
                            }}
                            options={[
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
                        <Table<RevenueChannelItem>
                            sticky
                            columns={revenueColumns}
                            dataSource={topChannelData.items}
                            loading={isFetching}
                            rowKey="channelId"
                            size="small"
                            pagination={false}
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

                {channelDetailModal.open && (
                    <DetailChannelAnalyticsModal
                        open={channelDetailModal.open}
                        onClose={() =>
                            setChannelDetailModal((prev) => ({
                                ...prev,
                                open: false,
                            }))
                        }
                        title={channelDetailModal.title}
                        channelId={channelDetailModal.channelId}
                        fromDate={dataFilter.startDate!}
                        toDate={dataFilter.endDate!}
                        releaseType={releaseType}
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
                        fromDate={dataFilter.startDate!}
                        toDate={dataFilter.endDate!}
                        releaseType={releaseType}
                    />
                )}
            </PageContainer>
        </div>
    );
}
