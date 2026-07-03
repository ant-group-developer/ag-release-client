'use client';

import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import DateSelect2 from '@/components/ui/select/date-select2';
import { SIZE_ICON } from '@/constants/common';
import { Col, Row, Segmented, Space, Tag } from 'antd';
import { DollarSign, Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useGetArtistOverview } from '../../hooks/use-get-artist-overview';
import { useGetArtistRevenueDspBarChart } from '../../hooks/use-get-artist-revenue-dsp-bar-chart';
import { useGetArtistRevenueLineChart } from '../../hooks/use-get-artist-revenue-line-chart';
import { useGetArtistRevenueTerBarChart } from '../../hooks/use-get-artist-revenue-ter-bar-chart';
import { useGetArtistTrendViewDspBarChart } from '../../hooks/use-get-artist-trend-view-dsp-bar-chart';
import { useGetArtistTrendViewLineChart } from '../../hooks/use-get-artist-trend-view-line-chart';
import { useGetArtistTrendViewTerBarChart } from '../../hooks/use-get-artist-trend-view-ter-bar-chart';
import RankingCard, { RankingCardView } from '../card/ranking-card';
import LineChartView from '../chart/line-chart-view';
import DetailStatsOverview from '../detail/detail-stats-overview';
import { formattedNumber } from '@/helpers/common';

enum AnalyticsViewType {
    DSP = 'dsp',
    TER = 'ter',
}

interface DetailArtistAnalyticsModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    artistId: string;
    fromDate: string;
    toDate: string;
}

export default function DetailArtistAnalyticsModal({
    open,
    onClose,
    title,
    artistId,
    fromDate,
    toDate,
}: DetailArtistAnalyticsModalProps) {
    const messages = useTranslations();

    const [localFromDate, setLocalFromDate] = useState(fromDate);
    const [localToDate, setLocalToDate] = useState(toDate);
    const [trendViewType, setTrendViewType] = useState<AnalyticsViewType>(
        AnalyticsViewType.DSP
    );
    const [revenueViewType, setRevenueViewType] = useState<AnalyticsViewType>(
        AnalyticsViewType.DSP
    );
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

    // Gọi API lấy thông tin tổng quan của Artist
    const { overviewData, isFetching } = useGetArtistOverview(
        artistId,
        { fromDate: localFromDate, toDate: localToDate },
        open
    );

    // Gọi API lấy thông tin biểu đồ doanh thu của Artist
    const { revenueLineChartData, isFetching: isLineChartFetching } =
        useGetArtistRevenueLineChart(
            artistId,
            { fromDate: localFromDate, toDate: localToDate },
            open
        );

    // Gọi API lấy thông tin biểu đồ lượt nghe của Artist
    const {
        lineChartData: trendViewLineChartData,
        isFetching: isTrendViewLineChartFetching,
    } = useGetArtistTrendViewLineChart(
        artistId,
        { fromDate: localFromDate, toDate: localToDate },
        open
    );

    // Gọi API lấy thông tin phân bố theo DSP của Artist
    const {
        dspBarChartData: trendViewDspBarChartData,
        isFetching: isTrendViewDspBarChartFetching,
    } = useGetArtistTrendViewDspBarChart(
        artistId,
        { fromDate: localFromDate, toDate: localToDate },
        open
    );

    // Gọi API lấy thông tin phân bố theo quốc gia của Artist
    const {
        terBarChartData: trendViewTerBarChartData,
        isFetching: isTrendViewTerBarChartFetching,
    } = useGetArtistTrendViewTerBarChart(
        artistId,
        { fromDate: localFromDate, toDate: localToDate },
        open
    );

    const mappedTrendPieData = useMemo(() => {
        if (trendViewType === AnalyticsViewType.DSP) {
            return trendViewDspBarChartData.map((item) => ({
                type: item.dspName,
                value: item.totalViews,
            }));
        } else {
            return trendViewTerBarChartData.map((item) => ({
                type: item.territory,
                value: item.totalViews,
            }));
        }
    }, [trendViewType, trendViewDspBarChartData, trendViewTerBarChartData]);

    const isTrendBarChartFetching =
        trendViewType === AnalyticsViewType.DSP
            ? isTrendViewDspBarChartFetching
            : isTrendViewTerBarChartFetching;

    // Gọi API lấy thông tin phân bố doanh thu theo DSP của Artist
    const { revenueDspBarChartData, isFetching: isRevenueDspBarChartFetching } =
        useGetArtistRevenueDspBarChart(
            artistId,
            { fromDate: localFromDate, toDate: localToDate },
            open
        );

    // Gọi API lấy thông tin phân bố doanh thu theo quốc gia của Artist
    const { revenueTerBarChartData, isFetching: isRevenueTerBarChartFetching } =
        useGetArtistRevenueTerBarChart(
            artistId,
            { fromDate: localFromDate, toDate: localToDate },
            open
        );

    const mappedRevenuePieData = useMemo(() => {
        if (revenueViewType === AnalyticsViewType.DSP) {
            return revenueDspBarChartData.map((item) => ({
                type: item.dspName,
                value: item.revenueUsd,
            }));
        } else {
            return revenueTerBarChartData.map((item) => ({
                type: item.territory,
                value: item.revenueUsd,
            }));
        }
    }, [revenueViewType, revenueDspBarChartData, revenueTerBarChartData]);

    const isRevenueBarChartFetching =
        revenueViewType === AnalyticsViewType.DSP
            ? isRevenueDspBarChartFetching
            : isRevenueTerBarChartFetching;

    const dspColumns = useMemo(
        () => [
            {
                title: messages('analytics2.rank'),
                dataIndex: 'rank',
                key: 'rank',
                width: 70,
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

    const terColumns = useMemo(
        () => [
            {
                title: messages('analytics2.rank'),
                dataIndex: 'rank',
                key: 'rank',
                width: 70,
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

    const mappedTrendDspRankData = useMemo(() => {
        return trendViewDspBarChartData.map((item, index) => ({
            ...item,
            rank: index + 1,
        }));
    }, [trendViewDspBarChartData]);

    const mappedTrendTerRankData = useMemo(() => {
        return trendViewTerBarChartData.map((item, index) => ({
            ...item,
            rank: index + 1,
        }));
    }, [trendViewTerBarChartData]);

    const revenueDspColumns = useMemo(
        () => [
            {
                title: messages('analytics2.rank'),
                dataIndex: 'rank',
                key: 'rank',
                width: 70,
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

    const revenueTerColumns = useMemo(
        () => [
            {
                title: messages('analytics2.rank'),
                dataIndex: 'rank',
                key: 'rank',
                width: 70,
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

    const mappedRevenueDspRankData = useMemo(() => {
        return revenueDspBarChartData.map((item, index) => ({
            ...item,
            rank: index + 1,
        }));
    }, [revenueDspBarChartData]);

    const mappedRevenueTerRankData = useMemo(() => {
        return revenueTerBarChartData.map((item, index) => ({
            ...item,
            rank: index + 1,
        }));
    }, [revenueTerBarChartData]);

    return (
        <FullScreenModal
            title={
                <div className="flex w-full items-center justify-between">
                    <Space>
                        <Tag className="!mr-0 !px-2 !py-1" color="green">
                            {messages('common.artist')}
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
                            title={messages('analytics.dspDistribution')}
                            columns={dspColumns}
                            dataSource={mappedTrendDspRankData}
                            loading={isTrendViewDspBarChartFetching}
                            rowKey="dspName"
                            labelKey="dspName"
                            valueKey="totalViews"
                            defaultView={RankingCardView.LIST}
                        />
                    </Col>
                    <Col xs={24} lg={12}>
                        <RankingCard
                            title={messages('analytics.revenueDspDistribution')}
                            columns={revenueDspColumns}
                            dataSource={mappedRevenueDspRankData}
                            loading={isRevenueDspBarChartFetching}
                            rowKey="dspName"
                            labelKey="dspName"
                            valueKey="revenueUsd"
                            defaultView={RankingCardView.LIST}
                            valuePrefix="$"
                        />
                    </Col>
                </Row>

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
        </FullScreenModal>
    );
}
