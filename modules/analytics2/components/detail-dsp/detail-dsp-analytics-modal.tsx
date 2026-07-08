'use client';

import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import DateSelect2 from '@/components/ui/select/date-select2';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { formattedNumber } from '@/helpers/common';
import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { RELEASE_COVER_ART_SIZE } from '@/modules/releases/constants';
import { Col, Row, Segmented, Space, Tag } from 'antd';
import { DollarSign, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import {
    ANALYTICS_RANKING_THUMBNAIL_SIZE,
    RANK_COLUMN_WIDTH,
} from '../../constants/types';
import { useGetDspOverview } from '../../hooks/use-get-dsp-overview';
import { useGetDspRevenueLineChart } from '../../hooks/use-get-dsp-revenue-line-chart';
import { useGetDspRevenueTerBarChart } from '../../hooks/use-get-dsp-revenue-ter-bar-chart';
import { useGetDspTopReleases } from '../../hooks/use-get-dsp-top-releases';
import { useGetDspTopTracks } from '../../hooks/use-get-dsp-top-tracks';
import { useGetDspTrendViewLineChart } from '../../hooks/use-get-dsp-trend-view-line-chart';
import { useGetDspTrendViewTerBarChart } from '../../hooks/use-get-dsp-trend-view-ter-bar-chart';
import { ReleaseRankingItem, TrackRankingItem } from '../../types';
import RankingCard, { RankingCardView } from '../card/ranking-card';
import LineChartView from '../chart/line-chart-view';
import DetailReleaseAnalyticsModal from '../detail-release/detail-release-analytics-modal';
import DetailTrackAnalyticsModal from '../detail-track/detail-track-analytics-modal';
import DetailStatsOverview from '../detail/detail-stats-overview';

interface DetailDspAnalyticsModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    pgDspId: string;
    dspReportId: string;
    fromDate: string;
    toDate: string;
}

export default function DetailDspAnalyticsModal({
    open,
    onClose,
    title,
    pgDspId,
    dspReportId,
    fromDate,
    toDate,
}: DetailDspAnalyticsModalProps) {
    const messages = useTranslations();

    const [localFromDate, setLocalFromDate] = useState(fromDate);
    const [localToDate, setLocalToDate] = useState(toDate);
    const [lineChartViewType, setLineChartViewType] = useState<
        'views' | 'revenue'
    >('views');

    const [detailReleaseModal, setDetailReleaseModal] = useState<{
        open: boolean;
        title: string;
        releaseId: string;
    }>({
        open: false,
        title: '',
        releaseId: '',
    });

    const [detailTrackModal, setDetailTrackModal] = useState<{
        open: boolean;
        title: string;
        isrc: string;
    }>({
        open: false,
        title: '',
        isrc: '',
    });

    // Đồng bộ lại ngày từ component cha khi mở modal
    useEffect(() => {
        if (open) {
            setLocalFromDate(fromDate);
            setLocalToDate(toDate);
        }
    }, [open, fromDate, toDate]);

    // Gọi API lấy thông tin Top Releases của DSP
    const { dspTopReleasesData, isFetching: isTopReleasesFetching } =
        useGetDspTopReleases(
            {
                pgDspId,
                dspReportId,
                fromDate: localFromDate,
                toDate: localToDate,
                topN: 5,
                isIncludeOther: true,
            },
            { enabled: open }
        );

    // Gọi API lấy thông tin Top Tracks của DSP
    const { dspTopTracksData, isFetching: isTopTracksFetching } =
        useGetDspTopTracks(
            {
                pgDspId,
                dspReportId,
                fromDate: localFromDate,
                toDate: localToDate,
                topN: 5,
                isIncludeOther: true,
            },
            { enabled: open }
        );

    // Gọi API lấy thông tin tổng quan của DSP
    const { overviewData, isFetching } = useGetDspOverview(
        { pgDspId, dspReportId, fromDate: localFromDate, toDate: localToDate },
        open
    );

    // Gọi API lấy thông tin biểu đồ doanh thu của DSP
    const {
        lineChartData: revenueLineChartData,
        isFetching: isLineChartFetching,
    } = useGetDspRevenueLineChart(
        { pgDspId, dspReportId, fromDate: localFromDate, toDate: localToDate },
        open
    );

    // Gọi API lấy thông tin biểu đồ lượt nghe của DSP
    const {
        lineChartData: trendViewLineChartData,
        isFetching: isTrendViewLineChartFetching,
    } = useGetDspTrendViewLineChart(
        { pgDspId, dspReportId, fromDate: localFromDate, toDate: localToDate },
        open
    );

    // Gọi API lấy thông tin phân bố theo quốc gia của DSP
    const {
        terBarChartData: trendViewTerBarChartData,
        isFetching: isTrendViewTerBarChartFetching,
    } = useGetDspTrendViewTerBarChart(
        { pgDspId, dspReportId, fromDate: localFromDate, toDate: localToDate },
        open
    );

    // Gọi API lấy thông tin phân bố doanh thu theo Tenant/Workspace của DSP
    // const {
    //     tenantBarChartData: revenueTenantBarChartData,
    //     isFetching: isRevenueTenantBarChartFetching,
    // } = useGetDspRevenueTenantBarChart(
    //     { pgDspId, dspReportId, fromDate: localFromDate, toDate: localToDate },
    //     open
    // );

    // Gọi API lấy thông tin phân bố doanh thu theo quốc gia của DSP
    const {
        terBarChartData: revenueTerBarChartData,
        isFetching: isRevenueTerBarChartFetching,
    } = useGetDspRevenueTerBarChart(
        { pgDspId, dspReportId, fromDate: localFromDate, toDate: localToDate },
        open
    );

    const terColumns = useMemo(
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
                width: 150,
                render: (views: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        {views ? views.toLocaleString() : 0}
                    </span>
                ),
            },
        ],
        [messages]
    );

    const mappedTrendTerRankData = useMemo(() => {
        return trendViewTerBarChartData.map((item, index) => ({
            ...item,
            rank: index + 1,
        }));
    }, [trendViewTerBarChartData]);

    const revenueTerColumns = useMemo(
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
                title: messages('common.revenue'),
                dataIndex: 'revenueUsd',
                key: 'revenueUsd',
                width: 150,
                render: (val: number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        ${val ? formattedNumber(val) : '0.00'}
                    </span>
                ),
            },
        ],
        [messages]
    );

    // const mappedRevenueTenantRankData = useMemo(() => {
    //     return revenueTenantBarChartData.map((item, index) => ({
    //         ...item,
    //         rank: index + 1,
    //     }));
    // }, [revenueTenantBarChartData]);

    const mappedRevenueTerRankData = useMemo(() => {
        return revenueTerBarChartData.map((item, index) => ({
            ...item,
            rank: index + 1,
        }));
    }, [revenueTerBarChartData]);

    const releaseColumns = useMemo(
        () => [
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
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setDetailReleaseModal({
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
                width: 100,
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
                width: 120,
                render: (val: string | number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        ${val ? formattedNumber(Number(val)) : '0.00'}
                    </span>
                ),
            },
        ],
        [messages]
    );

    const mappedTopReleasesRankData = useMemo(() => {
        return (dspTopReleasesData?.items ?? []).map((item, index) => ({
            ...item,
            rank: index + 1,
        }));
    }, [dspTopReleasesData]);

    const trackColumns = useMemo(
        () => [
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
                                record.release?.coverArtThumbnails?.[
                                    RELEASE_COVER_ART_SIZE.S75
                                ] as string
                            }
                        />
                        <CustomTooltip
                            title={messages('common.detailedAnalysis')}
                        >
                            <span
                                className="cursor-pointer truncate text-gray-900 transition-colors hover:text-blue-500 dark:text-zinc-100"
                                onClick={() =>
                                    setDetailTrackModal({
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
                ),
            },
            {
                title: 'ISRC',
                dataIndex: 'isrc',
                key: 'isrc',
                width: 140,
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
                width: 100,
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
                width: 120,
                render: (val: string | number) => (
                    <span className="text-gray-900 dark:text-zinc-100">
                        ${val ? formattedNumber(Number(val)) : '0.00'}
                    </span>
                ),
            },
        ],
        [messages]
    );

    const mappedTopTracksRankData = useMemo(() => {
        return (dspTopTracksData?.items ?? []).map((item, index) => ({
            ...item,
            rank: index + 1,
        }));
    }, [dspTopTracksData]);

    return (
        <FullScreenModal
            title={
                <div className="flex w-full items-center justify-between">
                    <Space>
                        <Tag className="!mr-0 !px-2 !py-1" color="green">
                            {messages('dsp.label')}
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
                            title={messages('analytics2.topReleases')}
                            columns={releaseColumns}
                            dataSource={mappedTopReleasesRankData}
                            loading={isTopReleasesFetching}
                            rowKey="releaseId"
                            labelKey="title"
                            valueKey="totalViews"
                            defaultView={RankingCardView.LIST}
                        />
                    </Col>
                    <Col xs={24} lg={12}>
                        <RankingCard
                            title={messages('analytics2.topTracks')}
                            columns={trackColumns}
                            dataSource={mappedTopTracksRankData}
                            loading={isTopTracksFetching}
                            rowKey="isrc"
                            labelKey="title"
                            valueKey="totalViews"
                            defaultView={RankingCardView.LIST}
                        />
                    </Col>
                </Row>

                {/* <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                        <RankingCard
                            title={messages('analytics.tenantDistribution')}
                            columns={tenantColumns}
                            dataSource={mappedTrendTenantRankData}
                            loading={isTrendViewTenantBarChartFetching}
                            rowKey="tenantName"
                            labelKey="tenantName"
                            valueKey="totalViews"
                            defaultView={RankingCardView.LIST}
                        />
                    </Col>
                    <Col xs={24} lg={12}>
                        <RankingCard
                            title={messages(
                                'analytics.revenueTenantDistribution'
                            )}
                            columns={revenueTenantColumns}
                            dataSource={mappedRevenueTenantRankData}
                            loading={isRevenueTenantBarChartFetching}
                            rowKey="tenantName"
                            labelKey="tenantName"
                            valueKey="revenueUsd"
                            defaultView={RankingCardView.LIST}
                            valuePrefix="$"
                        />
                    </Col>
                </Row> */}

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                        <RankingCard
                            title={messages('analytics.terDistribution')}
                            columns={terColumns}
                            dataSource={mappedTrendTerRankData}
                            loading={isTrendViewTerBarChartFetching}
                            rowKey="territory"
                            labelKey="territory"
                            valueKey="totalViews"
                            defaultView={RankingCardView.LIST}
                        />
                    </Col>
                    <Col xs={24} lg={12}>
                        <RankingCard
                            title={messages('analytics.revenueTerDistribution')}
                            columns={revenueTerColumns}
                            dataSource={mappedRevenueTerRankData}
                            loading={isRevenueTerBarChartFetching}
                            rowKey="territory"
                            labelKey="territory"
                            valueKey="revenueUsd"
                            defaultView={RankingCardView.LIST}
                            valuePrefix="$"
                        />
                    </Col>
                </Row>
            </div>
            {detailReleaseModal.open && (
                <DetailReleaseAnalyticsModal
                    open={detailReleaseModal.open}
                    onClose={() =>
                        setDetailReleaseModal((prev) => ({
                            ...prev,
                            open: false,
                        }))
                    }
                    title={detailReleaseModal.title}
                    releaseId={detailReleaseModal.releaseId}
                    fromDate={localFromDate}
                    toDate={localToDate}
                />
            )}
            {detailTrackModal.open && (
                <DetailTrackAnalyticsModal
                    open={detailTrackModal.open}
                    onClose={() =>
                        setDetailTrackModal((prev) => ({
                            ...prev,
                            open: false,
                        }))
                    }
                    title={detailTrackModal.title}
                    isrc={detailTrackModal.isrc}
                    fromDate={localFromDate}
                    toDate={localToDate}
                />
            )}
        </FullScreenModal>
    );
}
