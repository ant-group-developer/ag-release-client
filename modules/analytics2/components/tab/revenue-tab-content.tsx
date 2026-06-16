'use client';

import { Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useGetRevenueDspBarChart } from '../../hooks/use-get-revenue-dsp-bar-chart';
import { useGetRevenueLineChart } from '../../hooks/use-get-revenue-line-chart';
import RevenueMetricCards from '../card/revenue-metric-cards';
import LineChartView from '../chart/line-chart-view';
import PieChartView from '../chart/pie-chart-view';
import RevenueRankings from '../ranking/revenue-rankings';

interface Props {
    fromDate: string;
    toDate: string;
}

export default function RevenueTabContent({ fromDate, toDate }: Props) {
    const messages = useTranslations();

    const { revenueLineChartData, isFetching: isLineChartFetching } =
        useGetRevenueLineChart({
            fromDate,
            toDate,
        });

    const { revenueDspBarChartData, isFetching: isBarChartFetching } =
        useGetRevenueDspBarChart({
            fromDate,
            toDate,
        });

    const mappedPieData = useMemo(() => {
        return revenueDspBarChartData.map((item) => ({
            type: item.dspName,
            value: item.revenueUsd,
        }));
    }, [revenueDspBarChartData]);

    return (
        <>
            {/* 1. Overview Metric Cards */}
            <RevenueMetricCards fromDate={fromDate} toDate={toDate} />

            {/* Row with LineChart and PieChart */}
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
                                name: messages('analytics.revenue.totalPlays'),
                            },
                        ]}
                    />
                </Col>
                <Col xs={24} lg={9}>
                    <PieChartView
                        title={messages('analytics.revenueDspDistribution')}
                        data={mappedPieData}
                        loading={isBarChartFetching}
                        legendPosition="right"
                        chartHeight={200}
                        valuePrefix="$"
                    />
                </Col>
            </Row>

            {/* 2. Stacked Bar Chart */}
            {/* <RevenueTimelineChart fromDate={fromDate} toDate={toDate} /> */}

            {/* 3. Top Rankings */}
            <RevenueRankings fromDate={fromDate} toDate={toDate} />
        </>
    );
}
