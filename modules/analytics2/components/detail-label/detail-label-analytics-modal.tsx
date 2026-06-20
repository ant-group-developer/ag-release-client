'use client';

import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import DateSelect2 from '@/components/ui/select/date-select2';
import { Col, Row, Select } from 'antd';
import Title from 'antd/lib/typography/Title';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useGetLabelDspDailyTimeline } from '../../hooks/use-get-label-dsp-daily-timeline';
import { useGetLabelDspSalesTimeline } from '../../hooks/use-get-label-dsp-sales-timeline';
import { useGetLabelDspTimeline } from '../../hooks/use-get-label-dsp-timeline';
import { useGetLabelOverview } from '../../hooks/use-get-label-overview';
import { useGetLabelRevenueDspBarChart } from '../../hooks/use-get-label-revenue-dsp-bar-chart';
import { useGetLabelRevenueLineChart } from '../../hooks/use-get-label-revenue-line-chart';
import { useGetLabelRevenueTerBarChart } from '../../hooks/use-get-label-revenue-ter-bar-chart';
import { useGetLabelRevenueTimeline } from '../../hooks/use-get-label-revenue-timeline';
import { useGetLabelTrendViewDspBarChart } from '../../hooks/use-get-label-trend-view-dsp-bar-chart';
import { useGetLabelTrendViewLineChart } from '../../hooks/use-get-label-trend-view-line-chart';
import { useGetLabelTrendViewTerBarChart } from '../../hooks/use-get-label-trend-view-ter-bar-chart';
import LineChartView from '../chart/line-chart-view';
import PieChartView from '../chart/pie-chart-view';
import DetailStatsOverview from '../detail/detail-stats-overview';

interface DetailLabelAnalyticsModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    labelId: string;
    fromDate: string;
    toDate: string;
}

export default function DetailLabelAnalyticsModal({
    open,
    onClose,
    title,
    labelId,
    fromDate,
    toDate,
}: DetailLabelAnalyticsModalProps) {
    const messages = useTranslations();

    const [localFromDate, setLocalFromDate] = useState(fromDate);
    const [localToDate, setLocalToDate] = useState(toDate);
    const [range, setRange] = useState<number>(30);
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

    // Gọi API lấy thông tin tổng quan của Label
    const { overviewData, isFetching } = useGetLabelOverview(
        labelId,
        { fromDate: localFromDate, toDate: localToDate },
        open
    );

    // 1. Gọi API lấy thông tin xu hướng theo thời gian (Monthly) của Label
    const { timelineData: trendTimelineData, isFetching: isTrendFetching } =
        useGetLabelDspTimeline(
            labelId,
            {
                fromDate: localFromDate,
                toDate: localToDate,
                topN: 5,
                includeOther: true,
            },
            open
        );

    // 2. Gọi API lấy thông tin doanh số theo thời gian (Monthly) của Label
    const { timelineData: salesTimelineData, isFetching: isSalesFetching } =
        useGetLabelDspSalesTimeline(
            labelId,
            {
                fromDate: localFromDate,
                toDate: localToDate,
                topN: 5,
                includeOther: true,
            },
            open
        );

    // 3. Gọi API lấy thông tin xu hướng theo thời gian (Daily) của Label
    const toDateDaily = useMemo(() => dayjs().format('YYYY-MM-DD'), []);
    const fromDateDaily = useMemo(() => {
        return dayjs()
            .subtract(range - 1, 'day')
            .format('YYYY-MM-DD');
    }, [range]);

    const { timelineData: dailyTimelineData, isFetching: isDailyFetching } =
        useGetLabelDspDailyTimeline(
            labelId,
            {
                fromDate: fromDateDaily,
                toDate: toDateDaily,
                topN: 5,
                includeOther: true,
            },
            open
        );

    // 4. Gọi API lấy thông tin doanh thu theo thời gian của Label
    const { timelineData: revenueTimelineData, isFetching: isRevenueFetching } =
        useGetLabelRevenueTimeline(
            labelId,
            {
                fromDate: localFromDate,
                toDate: localToDate,
                topN: 5,
                includeOther: true,
            },
            open
        );

    // Gọi API lấy thông tin biểu đồ doanh thu của Label
    const { revenueLineChartData, isFetching: isLineChartFetching } =
        useGetLabelRevenueLineChart(
            labelId,
            { fromDate: localFromDate, toDate: localToDate },
            open
        );

    // Gọi API lấy thông tin biểu đồ lượt nghe của Label
    const {
        lineChartData: trendViewLineChartData,
        isFetching: isTrendViewLineChartFetching,
    } = useGetLabelTrendViewLineChart(
        labelId,
        { fromDate: localFromDate, toDate: localToDate },
        open
    );

    // Gọi API lấy thông tin phân bố theo DSP của Label
    const {
        dspBarChartData: trendViewDspBarChartData,
        isFetching: isTrendViewDspBarChartFetching,
    } = useGetLabelTrendViewDspBarChart(
        labelId,
        { fromDate: localFromDate, toDate: localToDate },
        open && trendViewType === 'dsp'
    );

    // Gọi API lấy thông tin phân bố theo quốc gia của Label
    const {
        terBarChartData: trendViewTerBarChartData,
        isFetching: isTrendViewTerBarChartFetching,
    } = useGetLabelTrendViewTerBarChart(
        labelId,
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

    // Gọi API lấy thông tin phân bố doanh thu theo DSP của Label
    const { revenueDspBarChartData, isFetching: isRevenueDspBarChartFetching } =
        useGetLabelRevenueDspBarChart(
            labelId,
            { fromDate: localFromDate, toDate: localToDate },
            open && revenueViewType === 'dsp'
        );

    // Gọi API lấy thông tin phân bố doanh thu theo quốc gia của Label
    const { revenueTerBarChartData, isFetching: isRevenueTerBarChartFetching } =
        useGetLabelRevenueTerBarChart(
            labelId,
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
                                entity: messages('common.label'),
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
