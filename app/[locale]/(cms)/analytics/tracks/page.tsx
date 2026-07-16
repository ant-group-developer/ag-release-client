'use client';
import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import DateSelect2 from '@/components/ui/select/date-select2';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { APP_ROUTES } from '@/enums/routes';
import { formattedNumber } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import DetailSourceTypeAnalyticsModal from '@/modules/analytics2/components/detail-source-type/detail-source-type-analytics-modal';
import DetailTrackAnalyticsModal from '@/modules/analytics2/components/detail-track/detail-track-analytics-modal';
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
import { useGetTrackRanking } from '@/modules/analytics2/hooks/use-get-rankings';
import { useGetRevenueTopTrack } from '@/modules/analytics2/hooks/use-get-revenue-data';
import { RevenueTrackItem, TrackRankingItem } from '@/modules/analytics2/types';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { CommonParams } from '@/types/api';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Segmented, Table, Tag, theme, Typography } from 'antd';
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

export default function TracksRankingPage() {
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

    const [trackDetailModal, setTrackDetailModal] = useState<{
        open: boolean;
        title: string;
        isrc: string;
    }>({
        open: false,
        title: '',
        isrc: '',
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

    const page = dataFilter.page ?? DEFAULT_PAGE;
    const pageSize = dataFilter.pageSize ?? PAGE_SIZE_DEFAULT;
    const isRevenue = currentType === ANALYTICS_VIEW_TYPE.REVENUE;

    // Fetch ranking data (Views)
    const { trackRankingData, isFetching: isViewsFetching } =
        useGetTrackRanking(
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
    const { topTrackData, isFetching: isRevenueFetching } =
        useGetRevenueTopTrack(
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

    const revenueColumns: ColumnsType<RevenueTrackItem> = [
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
                                className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
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
            width: 150,
            ellipsis: true,
            render: (text: string) => (
                <span className="truncate text-gray-500 dark:text-zinc-400">
                    {text || '—'}
                </span>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: 160,
            ellipsis: true,
            render: (text: string, record: RevenueTrackItem) => (
                <Typography.Text className="truncate">
                    {record?.labelName || '—'}
                </Typography.Text>
            ),
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

                if (!metadataExternalObj) return '—';
                const entries = Object.entries(metadataExternalObj).filter(
                    ([, metadata]: [string, any]) =>
                        !!metadata?.trackUrl || !!metadata?.albumUrl
                );
                if (entries.length === 0) return '—';
                return (
                    <div className="flex flex-wrap gap-1">
                        {entries.map(([key, metadata]: [string, any]) => {
                            const labelName =
                                key.charAt(0).toUpperCase() + key.slice(1);
                            return (
                                <Tag key={key} color="blue" className="m-0">
                                    <a
                                        href={
                                            metadata?.trackUrl ||
                                            metadata?.albumUrl
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {labelName}
                                    </a>
                                </Tag>
                            );
                        })}
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
                                    {item.sourceLabel}: $
                                    {formattedNumber(item.revenueUsd)}
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
            width: 120,
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
            width: 140,
            render: (val: number) => (
                <span className="text-gray-900 dark:text-zinc-100">
                    ${val ? formattedNumber(val) : '0.00'}
                </span>
            ),
        },
    ];

    const viewColumns: ColumnsType<TrackRankingItem> = [
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
                                className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
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
            width: 150,
            ellipsis: true,
            render: (text: string) => (
                <span className="truncate text-gray-500 dark:text-zinc-400">
                    {text || '—'}
                </span>
            ),
        },
        {
            title: messages('common.label'),
            dataIndex: 'labelName',
            key: 'labelName',
            width: 160,
            ellipsis: true,
            render: (text: string, record: TrackRankingItem) => (
                <Typography.Text className="truncate">
                    {text || record.release?.label?.name || '—'}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.onlineLink'),
            key: 'onlineLink',
            width: 160,
            render: (_, record: TrackRankingItem) => {
                const track = record.release?.tracks?.find(
                    (t) => t.isrc === record.isrc
                );
                const metadataExternalObj =
                    record.metadataExternal ||
                    track?.metadataExternal ||
                    record.release?.metadataExternal;

                if (!metadataExternalObj) return '—';
                const entries = Object.entries(metadataExternalObj).filter(
                    ([, metadata]: [string, any]) =>
                        !!metadata?.trackUrl || !!metadata?.albumUrl
                );
                if (entries.length === 0) return '—';
                return (
                    <div className="flex flex-wrap gap-1">
                        {entries.map(([key, metadata]: [string, any]) => {
                            const labelName =
                                key.charAt(0).toUpperCase() + key.slice(1);
                            return (
                                <Tag key={key} color="blue" className="m-0">
                                    <a
                                        href={
                                            metadata?.trackUrl ||
                                            metadata?.albumUrl
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {labelName}
                                    </a>
                                </Tag>
                            );
                        })}
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
                                    {item.sourceLabel}:{' '}
                                    {formattedNumber(item.quantity)}
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
            width: 140,
            render: (views: number) => (
                <span className="text-gray-900 dark:text-zinc-100">
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
                        <Table<RevenueTrackItem>
                            sticky
                            columns={revenueColumns}
                            dataSource={topTrackData.items}
                            loading={isFetching}
                            rowKey="isrc"
                            size="small"
                            pagination={false}
                            scroll={{ x: 'max-content' }}
                        />
                    ) : (
                        <Table<TrackRankingItem>
                            sticky
                            columns={viewColumns}
                            dataSource={trackRankingData.items}
                            loading={isFetching}
                            rowKey="isrc"
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

                {trackDetailModal.open && (
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
