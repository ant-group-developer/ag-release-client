'use client';

import ImageFallback from '@/components/ui/image/image-fallback';
import AppSearch from '@/components/ui/input/search';
import DateSelect2 from '@/components/ui/select/date-select2';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import {
    PAGE_SIZE_DEFAULT,
    PAGE_SIZE_EXTRA_LARGE,
    PAGE_SIZE_OPTIONS,
} from '@/constants/page-size';
import { APP_ROUTES } from '@/enums/routes';
import { useFilter } from '@/hooks/use-filter';
import DetailArtistAnalyticsModal from '@/modules/analytics2/components/detail-artist/detail-artist-analytics-modal';
import { ANALYTICS_RANKING_THUMBNAIL_SIZE } from '@/modules/analytics2/constants/types';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import { useGetArtistRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopArtist } from '@/modules/analytics2/hooks/use-get-revenue-data';
import {
    ArtistRankingItem,
    RevenueArtistItem,
} from '@/modules/analytics2/types';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { CommonParams } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { Avatar, Card, Table, theme } from 'antd';
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

export default function ArtistsRankingPage() {
    const { token } = theme.useToken();
    const messages = useTranslations();
    const { dspData } = useGetListDsp({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });

    const { dataFilter, onChangeFilter, onChangePage, onSearch } =
        useFilter<RankingFilter>({
            page: DEFAULT_PAGE,
            pageSize: PAGE_SIZE_DEFAULT,
            startDate: dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
            endDate: dayjs().format('YYYY-MM-DD'),
            type: ANALYTICS_VIEW_TYPE.VIEW,
        });

    const [detailModal, setDetailModal] = useState<{
        open: boolean;
        title: string;
        artistId: string;
    }>({
        open: false,
        title: '',
        artistId: '',
    });

    const page = dataFilter.page ?? DEFAULT_PAGE;
    const pageSize = dataFilter.pageSize ?? PAGE_SIZE_DEFAULT;
    const isRevenue = dataFilter.type === ANALYTICS_VIEW_TYPE.REVENUE;

    // Fetch ranking data (Views)
    const { artistRankingData, isFetching: isViewsFetching } =
        useGetArtistRanking(
            {
                fromDate: dataFilter.startDate!,
                toDate: dataFilter.endDate!,
                page,
                pageSize,
                keyword: dataFilter.keyword ?? undefined,
            },
            { enabled: !isRevenue }
        );

    // Fetch revenue ranking data
    const { topArtistData, isFetching: isRevenueFetching } =
        useGetRevenueTopArtist(
            {
                fromDate: dataFilter.startDate!,
                toDate: dataFilter.endDate!,
                page,
                pageSize,
                keyword: dataFilter.keyword ?? undefined,
                includeOther: false,
            },
            { enabled: isRevenue }
        );

    const isFetching = isRevenue ? isRevenueFetching : isViewsFetching;

    const revenueColumns: ColumnsType<RevenueArtistItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 120,
            align: 'center' as const,
            render: (rank: number) => (
                <span className="text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('common.artist'),
            dataIndex: 'artistName',
            key: 'artistName',
            ellipsis: true,
            render: (text: string, record: RevenueArtistItem) => (
                <div className="flex items-center gap-3">
                    <ImageFallback
                        src={record.picture ?? ''}
                        alt={text}
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        className="aspect-square rounded-full object-cover"
                    />
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <span
                            className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                            onClick={() =>
                                setDetailModal({
                                    open: true,
                                    title: text,
                                    artistId: record.artistId,
                                })
                            }
                        >
                            {text}
                        </span>
                    </CustomTooltip>
                </div>
            ),
        },
        {
            title: messages('artist.profiles'),
            key: 'profiles',
            dataIndex: 'profiles',
            width: 180,
            render: (_, record) => (
                <div>
                    <Avatar.Group
                        max={{
                            count: 5,
                            style: { backgroundColor: '#ccc' },
                        }}
                    >
                        {record?.profiles?.map((item) => {
                            const dsp = dspData?.items?.find(
                                (d) => d.code === item.dspCode
                            );
                            return (
                                <CustomTooltip
                                    key={item.dspCode}
                                    title={item.dspName || item.dspCode}
                                >
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Avatar
                                            src={dsp?.picture}
                                            style={{ backgroundColor: '#ccc' }}
                                        >
                                            {(item.dspName || item.dspCode)
                                                .charAt(0)
                                                .toUpperCase()}
                                        </Avatar>
                                    </a>
                                </CustomTooltip>
                            );
                        })}
                    </Avatar.Group>
                </div>
            ),
        },
        {
            title: messages('country.label'),
            key: 'country',
            dataIndex: 'country',
            width: 150,
            ellipsis: true,
            render: (_, record) => (
                <span className="text-gray-600 dark:text-zinc-400">
                    {record?.country || '-'}
                </span>
            ),
        },
        {
            title: messages('genre.label'),
            key: 'genre',
            dataIndex: 'genre',
            width: 150,
            ellipsis: true,
            render: (_, record) => (
                <span className="text-gray-600 dark:text-zinc-400">
                    {record?.genre || '-'}
                </span>
            ),
        },
        {
            title: messages('common.tracks'),
            dataIndex: 'trackCount',
            key: 'trackCount',
            width: 150,
            render: (count: number) => (
                <span className="text-gray-600 dark:text-zinc-400">
                    {count || 0}
                </span>
            ),
        },
        {
            title: messages('common.usage'),
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
                <span className="text-gray-900 dark:text-zinc-100">
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

    const viewColumns: ColumnsType<ArtistRankingItem> = [
        {
            title: messages('analytics2.rank'),
            dataIndex: 'rank',
            key: 'rank',
            width: 120,
            align: 'center' as const,
            render: (rank: number) => (
                <span className="text-gray-700 dark:text-zinc-300">
                    #{rank}
                </span>
            ),
        },
        {
            title: messages('common.artist'),
            dataIndex: 'artistName',
            key: 'artistName',
            ellipsis: true,
            render: (text: string, record: ArtistRankingItem) => (
                <div className="flex items-center gap-3">
                    <ImageFallback
                        src={record.picture ?? ''}
                        alt={text}
                        width={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        height={ANALYTICS_RANKING_THUMBNAIL_SIZE}
                        className="aspect-square rounded-full object-cover"
                    />
                    <CustomTooltip title={messages('common.detailedAnalysis')}>
                        <span
                            className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                            onClick={() =>
                                setDetailModal({
                                    open: true,
                                    title: text,
                                    artistId: record.artistId,
                                })
                            }
                        >
                            {text}
                        </span>
                    </CustomTooltip>
                </div>
            ),
        },
        {
            title: messages('artist.profiles'),
            key: 'profiles',
            dataIndex: 'profiles',
            width: 180,
            render: (_, record) => (
                <div>
                    <Avatar.Group
                        max={{
                            count: 5,
                            style: { backgroundColor: '#ccc' },
                        }}
                    >
                        {record?.profiles?.map((item) => {
                            const dsp = dspData?.items?.find(
                                (d) => d.code === item.dspCode
                            );
                            return (
                                <CustomTooltip
                                    key={item.dspCode}
                                    title={item.dspName || item.dspCode}
                                >
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Avatar
                                            size={28}
                                            src={dsp?.picture}
                                            style={{ backgroundColor: '#ccc' }}
                                        >
                                            {(item.dspName || item.dspCode)
                                                .charAt(0)
                                                .toUpperCase()}
                                        </Avatar>
                                    </a>
                                </CustomTooltip>
                            );
                        })}
                    </Avatar.Group>
                </div>
            ),
        },
        {
            title: messages('country.label'),
            key: 'country',
            dataIndex: 'country',
            width: 150,
            ellipsis: true,
            render: (_, record) => (
                <span className="text-gray-600 dark:text-zinc-400">
                    {record?.country || '-'}
                </span>
            ),
        },
        {
            title: messages('genre.label'),
            key: 'genre',
            dataIndex: 'genre',
            width: 150,
            ellipsis: true,
            render: (_, record) => (
                <span className="text-gray-600 dark:text-zinc-400">
                    {record?.genre || '-'}
                </span>
            ),
        },
        {
            title: messages('common.tracks'),
            dataIndex: 'trackCount',
            key: 'trackCount',
            width: 150,
            render: (count: number) => (
                <span className="text-gray-600 dark:text-zinc-400">
                    {count || 0}
                </span>
            ),
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
        ? `${messages('artist.artists')} - ${messages('common.revenue')}`
        : `${messages('artist.artists')} - ${messages('common.views')}`;

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
                        <Table<RevenueArtistItem>
                            sticky
                            size="small"
                            columns={revenueColumns}
                            dataSource={topArtistData.items}
                            loading={isFetching}
                            pagination={{
                                current: dataFilter.page,
                                pageSize: dataFilter.pageSize,
                                total: topArtistData?.metadata?.totalItems,
                                pageSizeOptions: PAGE_SIZE_OPTIONS,
                                showSizeChanger: true,
                                showTotal: (totalCount, range) =>
                                    `${range[0]}-${range[1]} / ${totalCount}`,
                                onChange: onChangePage,
                            }}
                        />
                    ) : (
                        <Table<ArtistRankingItem>
                            sticky
                            size="small"
                            columns={viewColumns}
                            dataSource={artistRankingData.items}
                            loading={isFetching}
                            pagination={{
                                current: dataFilter.page,
                                pageSize: dataFilter.pageSize,
                                total: artistRankingData?.metadata?.totalItems,
                                pageSizeOptions: PAGE_SIZE_OPTIONS,
                                showSizeChanger: true,
                                showTotal: (totalCount, range) =>
                                    `${range[0]}-${range[1]} / ${totalCount}`,
                                onChange: onChangePage,
                            }}
                        />
                    )}
                </Card>

                <DetailArtistAnalyticsModal
                    open={detailModal.open}
                    onClose={() =>
                        setDetailModal((prev) => ({ ...prev, open: false }))
                    }
                    title={detailModal.title}
                    artistId={detailModal.artistId}
                    fromDate={dataFilter.startDate!}
                    toDate={dataFilter.endDate!}
                />
            </PageContainer>
        </div>
    );
}
