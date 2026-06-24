'use client';

import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import DateSelect2 from '@/components/ui/select/date-select2';
import { Col, Row, Select, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useGetArtistOverview } from '../../hooks/use-get-artist-overview';
import { useGetArtistRevenueDspBarChart } from '../../hooks/use-get-artist-revenue-dsp-bar-chart';
import { useGetArtistRevenueLineChart } from '../../hooks/use-get-artist-revenue-line-chart';
import { useGetArtistRevenueTerBarChart } from '../../hooks/use-get-artist-revenue-ter-bar-chart';
import { useGetArtistTrendViewDspBarChart } from '../../hooks/use-get-artist-trend-view-dsp-bar-chart';
import { useGetArtistTrendViewLineChart } from '../../hooks/use-get-artist-trend-view-line-chart';
import { useGetArtistTrendViewTerBarChart } from '../../hooks/use-get-artist-trend-view-ter-bar-chart';
import LineChartView from '../chart/line-chart-view';
import PieChartView from '../chart/pie-chart-view';
import DetailStatsOverview from '../detail/detail-stats-overview';

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
    const [trendViewType, setTrendViewType] = useState<'dsp' | 'ter'>('dsp');
    const [revenueViewType, setRevenueViewType] = useState<'dsp' | 'ter'>(
        'dsp'
    );

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
        open && trendViewType === 'dsp'
    );

    // Gọi API lấy thông tin phân bố theo quốc gia của Artist
    const {
        terBarChartData: trendViewTerBarChartData,
        isFetching: isTrendViewTerBarChartFetching,
    } = useGetArtistTrendViewTerBarChart(
        artistId,
        { fromDate: localFromDate, toDate: localToDate },
        open && trendViewType === 'ter'
    );

    const mappedTrendPieData = useMemo(() => {
        if (trendViewType === 'dsp') {
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
        trendViewType === 'dsp'
            ? isTrendViewDspBarChartFetching
            : isTrendViewTerBarChartFetching;

    // Gọi API lấy thông tin phân bố doanh thu theo DSP của Artist
    const { revenueDspBarChartData, isFetching: isRevenueDspBarChartFetching } =
        useGetArtistRevenueDspBarChart(
            artistId,
            { fromDate: localFromDate, toDate: localToDate },
            open && revenueViewType === 'dsp'
        );

    // Gọi API lấy thông tin phân bố doanh thu theo quốc gia của Artist
    const { revenueTerBarChartData, isFetching: isRevenueTerBarChartFetching } =
        useGetArtistRevenueTerBarChart(
            artistId,
            { fromDate: localFromDate, toDate: localToDate },
            open && revenueViewType === 'ter'
        );

    const mappedRevenuePieData = useMemo(() => {
        if (revenueViewType === 'dsp') {
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
        revenueViewType === 'dsp'
            ? isRevenueDspBarChartFetching
            : isRevenueTerBarChartFetching;

    return (
        <FullScreenModal
            title={
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-md font-bold text-gray-900 dark:text-zinc-100">
                            {messages('analytics.detailTitle')}
                        </span>
                        <span className="font-normal text-gray-400 dark:text-zinc-500">
                            {messages('analytics2.detailEntityTitle', {
                                entity: messages('common.artist'),
                                title,
                            })}
                        </span>
                    </div>
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
                    <Col xs={24} lg={15}>
                        <LineChartView
                            title={messages('analytics.trendViewsByMonth')}
                            data={trendViewLineChartData}
                            xAxisKey="period"
                            lineKey="totalViews"
                            lineName={messages('common.viewCount')}
                            loading={isTrendViewLineChartFetching}
                            chartHeight={250}
                        />
                    </Col>
                    <Col xs={24} lg={9}>
                        <PieChartView
                            title={
                                <Select
                                    variant="borderless"
                                    value={trendViewType}
                                    onChange={(val) => setTrendViewType(val)}
                                    options={[
                                        {
                                            value: 'dsp',
                                            label: (
                                                <Typography.Title
                                                    level={5}
                                                    className="!text-sm"
                                                >
                                                    {messages(
                                                        'analytics.dspDistribution'
                                                    )}
                                                </Typography.Title>
                                            ),
                                        },
                                        {
                                            value: 'ter',
                                            label: (
                                                <Typography.Title
                                                    level={4}
                                                    className="!text-sm"
                                                >
                                                    {messages(
                                                        'analytics.terDistribution'
                                                    )}
                                                </Typography.Title>
                                            ),
                                        },
                                    ]}
                                    className="w-[250px]"
                                />
                            }
                            data={mappedTrendPieData}
                            loading={isTrendBarChartFetching}
                            legendPosition="right"
                            chartHeight={250}
                        />
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={15}>
                        <LineChartView
                            title={messages('analytics.totalRevenueByMonth')}
                            data={revenueLineChartData}
                            xAxisKey="period"
                            lineKey="revenueUsd"
                            lineName={messages('analytics.revenue.modeRevenue')}
                            loading={isLineChartFetching}
                            chartHeight={250}
                            valuePrefix="$"
                            additionalTooltipKeys={[
                                {
                                    key: 'quantity',
                                    name: messages('analytics.revenue.usage'),
                                },
                            ]}
                        />
                    </Col>
                    <Col xs={24} lg={9}>
                        <PieChartView
                            title={
                                <Select
                                    variant="borderless"
                                    value={revenueViewType}
                                    onChange={(val) => setRevenueViewType(val)}
                                    options={[
                                        {
                                            value: 'dsp',
                                            label: (
                                                <Typography.Title
                                                    level={5}
                                                    className="!text-sm"
                                                >
                                                    {messages(
                                                        'analytics.revenueDspDistribution'
                                                    )}
                                                </Typography.Title>
                                            ),
                                        },
                                        {
                                            value: 'ter',
                                            label: (
                                                <Typography.Title
                                                    level={4}
                                                    className="!text-sm"
                                                >
                                                    {messages(
                                                        'analytics.revenueTerDistribution'
                                                    )}
                                                </Typography.Title>
                                            ),
                                        },
                                    ]}
                                    className="w-[250px]"
                                />
                            }
                            data={mappedRevenuePieData}
                            loading={isRevenueBarChartFetching}
                            legendPosition="right"
                            chartHeight={250}
                            valuePrefix="$"
                        />
                    </Col>
                </Row>
            </div>
        </FullScreenModal>
    );
}
