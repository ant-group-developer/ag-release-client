'use client';

import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import DateSelect2 from '@/components/ui/select/date-select2';
import { SIZE_ICON } from '@/constants/common';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { ANALYTIC_SORT_BY } from '@/enums/common';
import { formattedNumber } from '@/helpers/common';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { Avatar, Col, Row, Segmented, Space, Tag } from 'antd';
import { DollarSign, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { ANALYTICS_RELEASE_TYPE } from '../../enums';
import { useGetReleaseDsp } from '../../hooks/use-get-release-dsp';
import { useGetReleaseOverview } from '../../hooks/use-get-release-overview';
import { useGetReleaseRevenueLineChart } from '../../hooks/use-get-release-revenue-line-chart';
import { useGetReleaseTer } from '../../hooks/use-get-release-ter';
import { useGetReleaseTrendViewLineChart } from '../../hooks/use-get-release-trend-view-line-chart';
import RankingCard, { RankingCardView } from '../card/ranking-card';
import LineChartView from '../chart/line-chart-view';
import DetailStatsOverview from '../detail/detail-stats-overview';

interface DetailReleaseAnalyticsModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    releaseId: string;
    fromDate: string;
    toDate: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

function normalizeMetadataKey(value?: string | null) {
    return value?.trim().toLowerCase();
}

function getDspByMetadataKey(key: string, dspData: any[]) {
    const normalizedKey = normalizeMetadataKey(key);

    return dspData.find((item) =>
        [item.code, item.codeCi, item.name].some(
            (value) => normalizeMetadataKey(value) === normalizedKey
        )
    );
}

export default function DetailReleaseAnalyticsModal({
    open,
    onClose,
    title,
    releaseId,
    fromDate,
    toDate,
    releaseType,
}: DetailReleaseAnalyticsModalProps) {
    const messages = useTranslations();

    const [localFromDate, setLocalFromDate] = useState(fromDate);
    const [localToDate, setLocalToDate] = useState(toDate);
    const [lineChartViewType, setLineChartViewType] = useState<
        'views' | 'revenue'
    >('views');

    // Đồng bộ lại ngày từ component cha khi mở modal
    useEffect(() => {
        if (open) {
            setLocalFromDate(fromDate);
            setLocalToDate(toDate);
        }
    }, [open, fromDate, toDate]);

    // Gọi API lấy thông tin tổng quan của Release
    const { overviewData, isFetching } = useGetReleaseOverview(releaseId, {
        fromDate: localFromDate,
        toDate: localToDate,
        releaseType,
    });

    // Gọi API lấy thông tin chi tiết của Release để lấy metadata external
    const { releaseData, isFetching: isDetailFetching } =
        useGetDetailRelease(releaseId);

    const { dspData: listDspData } = useGetListDsp({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });
    const dspItems = useMemo(
        () => listDspData?.items ?? [],
        [listDspData?.items]
    );

    // Gọi API lấy thông tin biểu đồ doanh thu của Release
    const { revenueLineChartData, isFetching: isLineChartFetching } =
        useGetReleaseRevenueLineChart(releaseId, {
            fromDate: localFromDate,
            toDate: localToDate,
            releaseType,
        });

    // Gọi API lấy thông tin biểu đồ lượt nghe của Release
    const {
        lineChartData: trendViewLineChartData,
        isFetching: isTrendViewLineChartFetching,
    } = useGetReleaseTrendViewLineChart(releaseId, {
        fromDate: localFromDate,
        toDate: localToDate,
        releaseType,
    });

    const [dspSortBy, setDspSortBy] = useState<ANALYTIC_SORT_BY>(
        ANALYTIC_SORT_BY.REVENUE
    );

    // Gọi API lấy danh sách DSP chi tiết phân trang của Release
    const { releaseDspData, isFetching: isReleaseDspFetching } =
        useGetReleaseDsp(releaseId, {
            fromDate: localFromDate,
            toDate: localToDate,
            sortBy: dspSortBy,
            topN: 5,
            includeOther: true,
            releaseType,
        });

    const [terSortBy, setTerSortBy] = useState<ANALYTIC_SORT_BY>(
        ANALYTIC_SORT_BY.REVENUE
    );

    // Gọi API lấy danh sách Territory chi tiết phân trang của Release
    const { releaseTerData, isFetching: isReleaseTerFetching } =
        useGetReleaseTer(releaseId, {
            fromDate: localFromDate,
            toDate: localToDate,
            sortBy: terSortBy,
            topN: 5,
            includeOther: true,
            releaseType,
        });

    const releaseDspColumns = useMemo(
        () => [
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
                title: 'DSP',
                dataIndex: 'dspName',
                key: 'dspName',
                ellipsis: true,
                render: (text: string) => (
                    <span className="truncate text-gray-900 dark:text-zinc-100">
                        {text || '—'}
                    </span>
                ),
            },
            {
                title: messages('common.viewCount'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: 180,
                sorter: true,
                sortOrder:
                    dspSortBy === ANALYTIC_SORT_BY.VIEWS
                        ? ('descend' as const)
                        : undefined,
                render: (views: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
                    </span>
                ),
            },
            {
                title: messages('common.revenue'),
                dataIndex: 'totalRevenueUsd',
                key: 'totalRevenueUsd',
                width: 180,
                sorter: true,
                sortOrder:
                    dspSortBy === ANALYTIC_SORT_BY.REVENUE
                        ? ('descend' as const)
                        : undefined,
                render: (val: string) => {
                    const numVal = parseFloat(val);
                    return (
                        <span className="font-medium text-gray-900 dark:text-zinc-100">
                            ${!isNaN(numVal) ? formattedNumber(numVal) : '0.00'}
                        </span>
                    );
                },
            },
        ],
        [messages, dspSortBy]
    );

    const mappedReleaseDspData = useMemo(() => {
        const rawData = Array.isArray(releaseDspData)
            ? releaseDspData
            : releaseDspData?.items || [];
        return rawData.map((item) => ({
            ...item,
            totalRevenueUsdNum: parseFloat(item.totalRevenueUsd) || 0,
        }));
    }, [releaseDspData]);

    const releaseTerColumns = useMemo(
        () => [
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
                title: messages('country.label'),
                dataIndex: 'territory',
                key: 'territory',
                ellipsis: true,
                render: (text: string) => (
                    <span className="truncate text-gray-900 dark:text-zinc-100">
                        {text || '—'}
                    </span>
                ),
            },
            {
                title: messages('common.viewCount'),
                dataIndex: 'totalViews',
                key: 'totalViews',
                width: 180,
                sorter: true,
                sortOrder:
                    terSortBy === ANALYTIC_SORT_BY.VIEWS
                        ? ('descend' as const)
                        : undefined,
                render: (views: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
                    </span>
                ),
            },
            {
                title: messages('common.revenue'),
                dataIndex: 'totalRevenueUsd',
                key: 'totalRevenueUsd',
                width: 180,
                sorter: true,
                sortOrder:
                    terSortBy === ANALYTIC_SORT_BY.REVENUE
                        ? ('descend' as const)
                        : undefined,
                render: (val: string) => {
                    const numVal = parseFloat(val);
                    return (
                        <span className="font-medium text-gray-900 dark:text-zinc-100">
                            ${!isNaN(numVal) ? formattedNumber(numVal) : '0.00'}
                        </span>
                    );
                },
            },
        ],
        [messages, terSortBy]
    );

    const mappedReleaseTerData = useMemo(() => {
        const rawData = Array.isArray(releaseTerData)
            ? releaseTerData
            : releaseTerData?.items || [];
        return rawData.map((item) => ({
            ...item,
            totalRevenueUsdNum: parseFloat(item.totalRevenueUsd) || 0,
        }));
    }, [releaseTerData]);

    const metadataColumns = useMemo(
        () => [
            {
                title: messages('track.dsp'),
                dataIndex: 'platform',
                key: 'platform',
                width: 150,
                render: (text: string) => {
                    const dsp = getDspByMetadataKey(text, dspItems);
                    return (
                        <div className="flex items-center gap-2">
                            <Avatar src={dsp?.picture} shape="square" size={32}>
                                {text[0]?.toUpperCase()}
                            </Avatar>
                            <span className="capitalize text-gray-900 dark:text-zinc-100">
                                {text}
                            </span>
                        </div>
                    );
                },
            },
            {
                title: messages('track.externalId'),
                dataIndex: 'albumId',
                key: 'albumId',
                ellipsis: true,
                render: (text: string) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {text || '—'}
                    </span>
                ),
            },
            {
                title: messages('track.albumUrl'),
                dataIndex: 'albumUrl',
                key: 'albumUrl',
                ellipsis: true,
                render: (url: string) =>
                    url ? (
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="!text-purple-500 hover:!text-purple-600 hover:underline"
                        >
                            {url}
                        </a>
                    ) : (
                        '—'
                    ),
            },
        ],
        [messages, dspItems]
    );

    const mappedMetadataExternalData = useMemo(() => {
        if (!releaseData?.metadataExternal) return [];
        return Object.entries(releaseData.metadataExternal)
            .filter(([_, value]) => !!value)
            .map(([platform, value]) => ({
                platform,
                albumId: value?.albumId,
                albumUrl: value?.albumUrl,
                coverUrl: value?.coverImages?.[0]?.url,
            }));
    }, [releaseData]);

    return (
        <FullScreenModal
            title={
                <div className="flex w-full items-center justify-between">
                    <Space>
                        <Tag className="!mr-0 !px-2 !py-1" color="green">
                            {messages('common.release')}
                        </Tag>
                        <span className="">{`${messages('analytics.label')}: ${title}`}</span>
                    </Space>
                    <DateSelect2
                        style={{ width: 240, height: 32 }}
                        value={`${localFromDate},${localToDate}`}
                        onChange={(value) => {
                            const [startDate, endDate] = value
                                .toString()
                                .split(',');
                            setLocalFromDate(startDate);
                            setLocalToDate(endDate);
                        }}
                    />
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
        >
            <div className="space-y-6 p-6">
                {/* 1. Phần overview 3 card */}
                <DetailStatsOverview
                    trendViews={overviewData?.totalTrendViews}
                    salesViews={overviewData?.totalSalesViews}
                    revenueUsd={overviewData?.totalRevenueUsd}
                    isLoading={isFetching}
                />

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={24}>
                        <LineChartView
                            title={
                                <div className="flex w-full items-center justify-between">
                                    <span className="text-base font-bold text-gray-800 dark:text-zinc-100">
                                        {lineChartViewType === 'views'
                                            ? messages(
                                                  'analytics.trendViewsByMonth'
                                              )
                                            : messages(
                                                  'analytics.totalRevenueByMonth'
                                              )}
                                    </span>
                                    <Segmented
                                        options={[
                                            {
                                                label: (
                                                    <div className="flex items-center gap-1.5">
                                                        <Eye size={SIZE_ICON} />
                                                        <span>
                                                            {messages(
                                                                'common.views'
                                                            )}
                                                        </span>
                                                    </div>
                                                ),
                                                value: 'views',
                                            },
                                            {
                                                label: (
                                                    <div className="flex items-center gap-1.5">
                                                        <DollarSign
                                                            size={SIZE_ICON}
                                                        />
                                                        <span>
                                                            {messages(
                                                                'common.revenue'
                                                            )}
                                                        </span>
                                                    </div>
                                                ),
                                                value: 'revenue',
                                            },
                                        ]}
                                        value={lineChartViewType}
                                        onChange={(val) =>
                                            setLineChartViewType(
                                                val as 'views' | 'revenue'
                                            )
                                        }
                                        className="flex-shrink-0"
                                    />
                                </div>
                            }
                            data={
                                lineChartViewType === 'views'
                                    ? trendViewLineChartData
                                    : revenueLineChartData
                            }
                            xAxisKey="period"
                            lineKey={
                                lineChartViewType === 'views'
                                    ? 'totalViews'
                                    : 'revenueUsd'
                            }
                            lineName={
                                lineChartViewType === 'views'
                                    ? messages('common.viewCount')
                                    : messages('analytics.revenue.modeRevenue')
                            }
                            loading={
                                lineChartViewType === 'views'
                                    ? isTrendViewLineChartFetching
                                    : isLineChartFetching
                            }
                            chartHeight={250}
                            valuePrefix={
                                lineChartViewType === 'revenue'
                                    ? '$'
                                    : undefined
                            }
                            additionalTooltipKeys={
                                lineChartViewType === 'revenue'
                                    ? [
                                          {
                                              key: 'quantity',
                                              name: messages(
                                                  'analytics.revenue.usage'
                                              ),
                                          },
                                      ]
                                    : undefined
                            }
                        />
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                        <RankingCard
                            title={
                                dspSortBy === ANALYTIC_SORT_BY.VIEWS
                                    ? messages('analytics.dspDistribution')
                                    : messages(
                                          'analytics.revenueDspDistribution'
                                      )
                            }
                            columns={releaseDspColumns}
                            dataSource={mappedReleaseDspData}
                            loading={isReleaseDspFetching}
                            rowKey="dspId"
                            labelKey="dspName"
                            defaultView={RankingCardView.LIST}
                            valueKey={
                                lineChartViewType === 'views'
                                    ? 'totalViews'
                                    : 'totalRevenueUsdNum'
                            }
                            valuePrefix={
                                lineChartViewType === 'revenue'
                                    ? '$'
                                    : undefined
                            }
                            onChange={(pagination, filters, sorter: any) => {
                                const field = sorter.field;
                                if (field === 'totalViews') {
                                    setDspSortBy(ANALYTIC_SORT_BY.VIEWS);
                                } else if (field === 'totalRevenueUsd') {
                                    setDspSortBy(ANALYTIC_SORT_BY.REVENUE);
                                }
                            }}
                        />
                    </Col>
                    <Col xs={24} lg={12}>
                        <RankingCard
                            title={
                                terSortBy === ANALYTIC_SORT_BY.VIEWS
                                    ? messages('analytics.terDistribution')
                                    : messages(
                                          'analytics.revenueTerDistribution'
                                      )
                            }
                            columns={releaseTerColumns}
                            dataSource={mappedReleaseTerData}
                            loading={isReleaseTerFetching}
                            rowKey="territory"
                            labelKey="territory"
                            defaultView={RankingCardView.LIST}
                            valueKey={
                                lineChartViewType === 'views'
                                    ? 'totalViews'
                                    : 'totalRevenueUsdNum'
                            }
                            valuePrefix={
                                lineChartViewType === 'revenue'
                                    ? '$'
                                    : undefined
                            }
                            onChange={(pagination, filters, sorter: any) => {
                                const field = sorter.field;
                                if (field === 'totalViews') {
                                    setTerSortBy(ANALYTIC_SORT_BY.VIEWS);
                                } else if (field === 'totalRevenueUsd') {
                                    setTerSortBy(ANALYTIC_SORT_BY.REVENUE);
                                }
                            }}
                        />
                    </Col>

                    <Col xs={24} lg={12}>
                        <RankingCard
                            title={messages('release.overview.onlineLinks')}
                            columns={metadataColumns}
                            dataSource={mappedMetadataExternalData}
                            loading={isDetailFetching}
                            rowKey="platform"
                            labelKey="platform"
                            valueKey="albumId"
                            defaultView={RankingCardView.LIST}
                        />
                    </Col>
                </Row>
            </div>
        </FullScreenModal>
    );
}
