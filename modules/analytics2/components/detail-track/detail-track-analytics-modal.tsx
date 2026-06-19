'use client';

import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import DateSelect2 from '@/components/ui/select/date-select2';
import { Col, Row, Select } from 'antd';
import Title from 'antd/lib/typography/Title';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useGetTrackOverview } from '../../hooks/use-get-track-overview';
import { useGetTrackRevenueDspBarChart } from '../../hooks/use-get-track-revenue-dsp-bar-chart';
import { useGetTrackRevenueLineChart } from '../../hooks/use-get-track-revenue-line-chart';
import { useGetTrackRevenueTerBarChart } from '../../hooks/use-get-track-revenue-ter-bar-chart';
import { useGetTrackTrendViewDspBarChart } from '../../hooks/use-get-track-trend-view-dsp-bar-chart';
import { useGetTrackTrendViewLineChart } from '../../hooks/use-get-track-trend-view-line-chart';
import { useGetTrackTrendViewTerBarChart } from '../../hooks/use-get-track-trend-view-ter-bar-chart';
import LineChartView from '../chart/line-chart-view';
import PieChartView from '../chart/pie-chart-view';
import DetailStatsOverview from '../detail/detail-stats-overview';

interface DetailTrackAnalyticsModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    isrc: string;
    fromDate: string;
    toDate: string;
}

export default function DetailTrackAnalyticsModal({
    open,
    onClose,
    title,
    isrc,
    fromDate,
    toDate,
}: DetailTrackAnalyticsModalProps) {
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

    // Gọi API lấy thông tin tổng quan của Track
    const { overviewData, isFetching } = useGetTrackOverview(
        isrc,
        { fromDate: localFromDate, toDate: localToDate },
        open
    );

    // Gọi API lấy thông tin biểu đồ doanh thu của Track
    const { revenueLineChartData, isFetching: isLineChartFetching } =
        useGetTrackRevenueLineChart(
            isrc,
            { fromDate: localFromDate, toDate: localToDate },
            open
        );

    // Gọi API lấy thông tin biểu đồ lượt nghe của Track
    const {
        lineChartData: trendViewLineChartData,
        isFetching: isTrendViewLineChartFetching,
    } = useGetTrackTrendViewLineChart(
        isrc,
        { fromDate: localFromDate, toDate: localToDate },
        open
    );

    // Gọi API lấy thông tin phân bố theo DSP của Track
    const {
        dspBarChartData: trendViewDspBarChartData,
        isFetching: isTrendViewDspBarChartFetching,
    } = useGetTrackTrendViewDspBarChart(
        isrc,
        { fromDate: localFromDate, toDate: localToDate },
        open && trendViewType === 'dsp'
    );

    // Gọi API lấy thông tin phân bố theo quốc gia của Track
    const {
        terBarChartData: trendViewTerBarChartData,
        isFetching: isTrendViewTerBarChartFetching,
    } = useGetTrackTrendViewTerBarChart(
        isrc,
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

    // Gọi API lấy thông tin phân bố doanh thu theo DSP của Track
    const { revenueDspBarChartData, isFetching: isRevenueDspBarChartFetching } =
        useGetTrackRevenueDspBarChart(
            isrc,
            { fromDate: localFromDate, toDate: localToDate },
            open && revenueViewType === 'dsp'
        );

    // Gọi API lấy thông tin phân bố doanh thu theo quốc gia của Track
    const { revenueTerBarChartData, isFetching: isRevenueTerBarChartFetching } =
        useGetTrackRevenueTerBarChart(
            isrc,
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
                        <span className="text-xs font-normal text-gray-400 dark:text-zinc-500">
                            {messages('analytics2.detailEntityTitle', {
                                entity: messages('common.track'),
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
                                                <Title
                                                    level={5}
                                                    className="!text-sm"
                                                >
                                                    {messages(
                                                        'analytics.dspDistribution'
                                                    )}
                                                </Title>
                                            ),
                                        },
                                        {
                                            value: 'ter',
                                            label: (
                                                <Title
                                                    level={4}
                                                    className="!text-sm"
                                                >
                                                    {messages(
                                                        'analytics.terDistribution'
                                                    )}
                                                </Title>
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
                            title={messages('analytics.revenue.label')}
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
                                                <Title
                                                    level={5}
                                                    className="!text-sm"
                                                >
                                                    {messages(
                                                        'analytics.revenueDspDistribution'
                                                    )}
                                                </Title>
                                            ),
                                        },
                                        {
                                            value: 'ter',
                                            label: (
                                                <Title
                                                    level={4}
                                                    className="!text-sm"
                                                >
                                                    {messages(
                                                        'analytics.revenueTerDistribution'
                                                    )}
                                                </Title>
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
