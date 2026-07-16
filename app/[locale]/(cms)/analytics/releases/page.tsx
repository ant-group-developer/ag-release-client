'use client';

import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import DateSelect2 from '@/components/ui/select/date-select2';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { APP_ROUTES } from '@/enums/routes';
import { formattedNumber } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import DetailReleaseAnalyticsModal from '@/modules/analytics2/components/detail-release/detail-release-analytics-modal';
import DetailSourceTypeAnalyticsModal from '@/modules/analytics2/components/detail-source-type/detail-source-type-analytics-modal';
import { ANALYTICS_RANKING_THUMBNAIL_SIZE } from '@/modules/analytics2/constants/types';
import { ANALYTICS_RELEASE_TYPE } from '@/modules/analytics2/enums';
import { ANALYTICS_VIEW_TYPE } from '@/modules/analytics2/enums/tabs';
import {
    getAnalyticsReleaseType,
    getAnalyticsViewType,
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

export default function ReleasesRankingPage() {
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

    const [detailModal, setDetailModal] = useState<{
        open: boolean;
        title: string;
        releaseId: string;
    }>({
        open: false,
        title: '',
        releaseId: '',
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
    const { releaseRankingData, isFetching: isViewsFetching } =
        useGetReleaseRanking(
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
    const { topReleaseData, isFetching: isRevenueFetching } =
        useGetRevenueTopRelease(
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

    const revenueColumns: ColumnsType<RevenueReleaseItem> = [
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
            title: messages('common.release'),
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
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
                    <div className="flex min-w-0 flex-col">
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setDetailModal({
                                        open: true,
                                        title: text,
                                        releaseId: record.releaseId,
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
            title: 'UPC',
            dataIndex: 'upc',
            key: 'upc',
            width: 140,
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
            width: 140,
            ellipsis: true,
            render: (text: string) => (
                <Typography.Text className="truncate">
                    {text || '—'}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.workspace'),
            key: 'workspace',
            width: 150,
            ellipsis: true,
            render: (_, record: RevenueReleaseItem) => {
                const workspaceName =
                    record.workspace?.name || record.release?.tenant?.name;
                return (
                    <Typography.Text className="truncate">
                        {workspaceName || '—'}
                    </Typography.Text>
                );
            },
        },
        {
            title: messages('common.onlineLink'),
            key: 'onlineLink',
            width: 140,
            render: (_, record: RevenueReleaseItem) => {
                const metadataExternal = record.release?.metadataExternal;
                if (!metadataExternal) return '—';
                const entries = Object.entries(metadataExternal).filter(
                    ([, metadata]) => !!metadata?.albumUrl
                );
                if (entries.length === 0) return '—';
                return (
                    <div className="flex flex-wrap gap-1">
                        {entries.map(([key, metadata]) => {
                            const labelName =
                                key.charAt(0).toUpperCase() + key.slice(1);
                            return (
                                <Tag key={key} color="blue" className="m-0">
                                    <a
                                        href={metadata?.albumUrl}
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
            title: messages('common.tracks'),
            dataIndex: 'trackCount',
            key: 'trackCount',
            width: 80,
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
            width: 100,
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
            width: 120,
            render: (val: number) => (
                <span className="text-gray-900 dark:text-zinc-100">
                    ${val ? formattedNumber(val) : '0.00'}
                </span>
            ),
        },
    ];

    const viewColumns: ColumnsType<ReleaseRankingItem> = [
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
            title: messages('common.release'),
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
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
                    <div className="flex min-w-0 flex-col">
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setDetailModal({
                                        open: true,
                                        title: text,
                                        releaseId: record.releaseId,
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
            title: 'UPC',
            dataIndex: 'upc',
            key: 'upc',
            width: 140,
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
            width: 140,
            ellipsis: true,
            render: (text: string) => (
                <Typography.Text className="truncate">
                    {text || '—'}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.workspace'),
            key: 'workspace',
            width: 150,
            ellipsis: true,
            render: (_, record: ReleaseRankingItem) => {
                const workspaceName = record.release?.tenant?.name;
                return (
                    <Typography.Text className="truncate">
                        {workspaceName || '—'}
                    </Typography.Text>
                );
            },
        },
        {
            title: messages('common.onlineLink'),
            key: 'onlineLink',
            width: 140,
            render: (_, record: ReleaseRankingItem) => {
                const metadataExternal = record.release?.metadataExternal;
                if (!metadataExternal) return '—';
                const entries = Object.entries(metadataExternal).filter(
                    ([, metadata]) => !!metadata?.albumUrl
                );
                if (entries.length === 0) return '—';
                return (
                    <div className="flex flex-wrap gap-1">
                        {entries.map(([key, metadata]) => {
                            const labelName =
                                key.charAt(0).toUpperCase() + key.slice(1);
                            return (
                                <Tag key={key} color="blue" className="m-0">
                                    <a
                                        href={metadata?.albumUrl}
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
            width: 150,
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
            title: messages('common.tracks'),
            dataIndex: 'trackCount',
            key: 'trackCount',
            width: 80,
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
            width: 120,
            render: (views: number) => (
                <span className="text-gray-900 dark:text-zinc-100">
                    {views ? views.toLocaleString() : 0}
                </span>
            ),
        },
    ];

    const pageTitle = isRevenue
        ? `${messages('common.releases')} - ${messages('common.revenue')}`
        : `${messages('common.releases')} - ${messages('common.views')}`;

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
                        picker="month"
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
                        <Table<RevenueReleaseItem>
                            sticky
                            size="small"
                            columns={revenueColumns}
                            dataSource={topReleaseData.items}
                            loading={isFetching}
                            rowKey="releaseId"
                            pagination={false}
                            scroll={{ x: 'max-content' }}
                        />
                    ) : (
                        <Table<ReleaseRankingItem>
                            sticky
                            size="small"
                            columns={viewColumns}
                            dataSource={releaseRankingData.items}
                            loading={isFetching}
                            rowKey="releaseId"
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

                {detailModal.open && (
                    <DetailReleaseAnalyticsModal
                        open={detailModal.open}
                        onClose={() =>
                            setDetailModal((prev) => ({ ...prev, open: false }))
                        }
                        title={detailModal.title}
                        releaseId={detailModal.releaseId}
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
