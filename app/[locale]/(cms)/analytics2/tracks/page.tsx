'use client';
import AppSearch from '@/components/ui/input/search';
import DateSelect2 from '@/components/ui/select/date-select2';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { APP_ROUTES } from '@/enums/routes';
import { useFilter } from '@/hooks/use-filter';
import DetailTrackAnalyticsModal from '@/modules/analytics2/components/detail-track/detail-track-analytics-modal';
import { ANALYTICS_RANKING_THUMBNAIL_SIZE } from '@/modules/analytics2/constants/types';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import { useGetTrackRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopTrack } from '@/modules/analytics2/hooks/use-get-revenue-data';
import { RevenueTrackItem, TrackRankingItem } from '@/modules/analytics2/types';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { CommonParams } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Table, theme } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const DEFAULT_PAGE = 1;

interface RankingFilter extends CommonParams {
    startDate?: string;
    endDate?: string;
    type?: ANALYTICS_VIEW_TYPE;
}

export default function TracksRankingPage() {
    const { token } = theme.useToken();
    const messages = useTranslations();

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<RankingFilter>({
            page: DEFAULT_PAGE,
            pageSize: PAGE_SIZE_DEFAULT,
            startDate: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
            endDate: dayjs().format('YYYY-MM-DD'),
            type: ANALYTICS_VIEW_TYPE.VIEW,
        });

    const [trackDetailModal, setTrackDetailModal] = useState<{
        open: boolean;
        title: string;
        isrc: string;
    }>({
        open: false,
        title: '',
        isrc: '',
    });

    const page = dataFilter.page ?? DEFAULT_PAGE;
    const pageSize = dataFilter.pageSize ?? PAGE_SIZE_DEFAULT;
    const isRevenue = dataFilter.type === ANALYTICS_VIEW_TYPE.REVENUE;

    // Fetch ranking data (Views)
    const { trackRankingData, isFetching: isViewsFetching } =
        useGetTrackRanking(
            {
                fromDate: dataFilter.startDate!,
                toDate: dataFilter.endDate!,
                page,
                pageSize,
                keyword: dataFilter.keyword,
            },
            { enabled: !isRevenue }
        );

    // Fetch revenue ranking data
    const { topTrackData, isFetching: isRevenueFetching } =
        useGetRevenueTopTrack(
            {
                fromDate: dataFilter.startDate!,
                toDate: dataFilter.endDate!,
                page,
                pageSize,
                keyword: dataFilter.keyword,
                includeOther: false,
            },
            { enabled: isRevenue }
        );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;
    const rankingData = isRevenue ? topTrackData : trackRankingData;

    const revenueColumns: ColumnsType<RevenueTrackItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 80,
            align: 'center' as const,
            render: (rank: number) => (
                <span className="font-bold text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('common.track'),
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
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
                    <div className="flex min-w-0 flex-col">
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate font-medium text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setTrackDetailModal({
                                        open: true,
                                        title: text,
                                        isrc: record.isrc,
                                    })
                                }
                            >
                                {text}
                            </span>
                        </CustomTooltip>
                    </div>
                </div>
            ),
        },
        {
            title: 'ISRC',
            dataIndex: 'isrc',
            key: 'isrc',
            width: 180,
            ellipsis: true,
            render: (text: string) => (
                <span className="truncate text-gray-500 dark:text-zinc-400">
                    {text || '—'}
                </span>
            ),
        },
        {
            title: messages('common.quantity'),
            dataIndex: 'quantity',
            key: 'quantity',
            width: 150,
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
                <span className="font-semibold text-gray-900 dark:text-zinc-100">
                    $
                    {val
                        ? val.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                          })
                        : '0.00'}
                </span>
            ),
        },
    ];

    const viewColumns: ColumnsType<TrackRankingItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 80,
            align: 'center' as const,
            render: (rank: number) => (
                <span className="font-bold text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('common.track'),
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
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
                    <div className="flex min-w-0 flex-col">
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate font-medium text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setTrackDetailModal({
                                        open: true,
                                        title: text,
                                        isrc: record.isrc,
                                    })
                                }
                            >
                                {text}
                            </span>
                        </CustomTooltip>
                    </div>
                </div>
            ),
        },
        {
            title: 'ISRC',
            dataIndex: 'isrc',
            key: 'isrc',
            width: 200,
            ellipsis: true,
            render: (text: string) => (
                <span className="truncate text-gray-500 dark:text-zinc-400">
                    {text || '—'}
                </span>
            ),
        },
        {
            title: messages('common.viewCount'),
            dataIndex: 'totalViews',
            key: 'totalViews',
            width: 180,
            render: (views: number) => (
                <span className="font-semibold text-gray-900 dark:text-zinc-100">
                    {views ? views.toLocaleString() : 0}
                </span>
            ),
        },
    ];

    const pageTitle = isRevenue
        ? `${messages('common.tracks')} - ${messages('common.revenue')}`
        : `${messages('common.tracks')} - ${messages('common.views')}`;

    const breadcrumbs = [
        {
            title: messages('analytics.label'),
            href: APP_ROUTES.ANALYTICS2,
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
                    <div style={{ marginBottom: 16 }}>
                        <AppSearch
                            onChange={onSearch}
                            defaultValue={dataFilter.keyword}
                            style={{ width: 200 }}
                        />
                    </div>
                    {isRevenue ? (
                        <Table<RevenueTrackItem>
                            columns={revenueColumns}
                            dataSource={topTrackData.items}
                            loading={isFetching}
                            rowKey="isrc"
                            pagination={{
                                current: dataFilter.page,
                                pageSize: dataFilter.pageSize,
                                total: topTrackData?.metadata?.totalItems,
                                pageSizeOptions: PAGE_SIZE_OPTIONS,
                                showSizeChanger: true,
                                showTotal: (totalCount, range) =>
                                    `${range[0]}-${range[1]} / ${totalCount}`,
                                onChange: onChangePage,
                            }}
                        />
                    ) : (
                        <Table<TrackRankingItem>
                            columns={viewColumns}
                            dataSource={trackRankingData.items}
                            loading={isFetching}
                            rowKey="isrc"
                            pagination={{
                                current: dataFilter.page,
                                pageSize: dataFilter.pageSize,
                                total: trackRankingData?.metadata?.totalItems,
                                pageSizeOptions: PAGE_SIZE_OPTIONS,
                                showSizeChanger: true,
                                showTotal: (totalCount, range) =>
                                    `${range[0]}-${range[1]} / ${totalCount}`,
                                onChange: onChangePage,
                            }}
                        />
                    )}
                </Card>

                <DetailTrackAnalyticsModal
                    open={trackDetailModal.open}
                    onClose={() =>
                        setTrackDetailModal((prev) => ({
                            ...prev,
                            open: false,
                        }))
                    }
                    title={trackDetailModal.title}
                    isrc={trackDetailModal.isrc}
                    fromDate={dataFilter.startDate!}
                    toDate={dataFilter.endDate!}
                />
            </PageContainer>
        </div>
    );
}
