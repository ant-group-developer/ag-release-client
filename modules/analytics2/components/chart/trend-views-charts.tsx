import { Col, Row, Segmented } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import {
    ANALYTICS_BAR_CHART_TYPE,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_RELEASE_TYPE,
} from '../../enums';
import { useGetRevenueDspBarChart } from '../../hooks/use-get-revenue-dsp-bar-chart';
import { useGetRevenueLineChart } from '../../hooks/use-get-revenue-line-chart';
import { useGetRevenueTerBarChart } from '../../hooks/use-get-revenue-ter-bar-chart';
import { useGetTrendViewDspBarChart } from '../../hooks/use-get-trend-view-dsp-bar-chart';
import { useGetTrendViewLineChart } from '../../hooks/use-get-trend-view-line-chart';
import { useGetTrendViewTerBarChart } from '../../hooks/use-get-trend-view-ter-bar-chart';
import LineChartView from './line-chart-view';
import PieChartView from './pie-chart-view';

interface TrendViewsChartsProps {
    fromDate: string;
    toDate: string;
    releaseType: ANALYTICS_RELEASE_TYPE;
    activeMetric?: string;
}

export default function TrendViewsCharts({
    fromDate,
    toDate,
    releaseType,
    activeMetric = ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
}: TrendViewsChartsProps) {
    const messages = useTranslations();
    const [viewType, setViewType] = useState<ANALYTICS_BAR_CHART_TYPE>(
        ANALYTICS_BAR_CHART_TYPE.DSP
    );

    const isRevenueMetric =
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_USAGE ||
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD;
    const isUsage = activeMetric === ANALYTICS_METRIC_KEY.TOTAL_USAGE;
    const isRevenueUsd =
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD;

    const {
        lineChartData: trendViewLineData,
        isFetching: isTrendViewLineFetching,
    } = useGetTrendViewLineChart(
        {
            fromDate,
            toDate,
            releaseType,
        },
        { enabled: !isRevenueMetric }
    );

    const {
        barChartData: dspTrendViewData,
        isFetching: isDspTrendViewFetching,
    } = useGetTrendViewDspBarChart(
        {
            fromDate,
            toDate,
            releaseType,
        },
        {
            enabled:
                !isRevenueMetric && viewType === ANALYTICS_BAR_CHART_TYPE.DSP,
        }
    );

    const {
        barChartData: terTrendViewData,
        isFetching: isTerTrendViewFetching,
    } = useGetTrendViewTerBarChart(
        {
            fromDate,
            toDate,
            releaseType,
        },
        {
            enabled:
                !isRevenueMetric &&
                viewType === ANALYTICS_BAR_CHART_TYPE.TERRITORY,
        }
    );

    const { revenueLineChartData, isFetching: isRevenueLineFetching } =
        useGetRevenueLineChart(
            {
                fromDate,
                toDate,
                releaseType,
            },
            { enabled: isRevenueMetric }
        );

    const { revenueDspBarChartData, isFetching: isDspRevenueFetching } =
        useGetRevenueDspBarChart(
            {
                fromDate,
                toDate,
                releaseType,
            },
            {
                enabled:
                    isRevenueMetric &&
                    viewType === ANALYTICS_BAR_CHART_TYPE.DSP,
            }
        );

    const { revenueTerBarChartData, isFetching: isTerRevenueFetching } =
        useGetRevenueTerBarChart(
            {
                fromDate,
                toDate,
                releaseType,
            },
            {
                enabled:
                    isRevenueMetric &&
                    viewType === ANALYTICS_BAR_CHART_TYPE.TERRITORY,
            }
        );

    const lineChartData = isRevenueMetric
        ? revenueLineChartData
        : trendViewLineData;
    const isLineChartFetching = isRevenueMetric
        ? isRevenueLineFetching
        : isTrendViewLineFetching;

    const lineKey = useMemo(() => {
        if (isRevenueUsd) return 'revenueUsd';
        if (isUsage) return 'quantity';
        return 'totalViews';
    }, [isRevenueUsd, isUsage]);

    const lineName = useMemo(() => {
        if (isRevenueUsd) return messages('analytics.totalRevenueUsd');
        if (isUsage) return messages('analytics.totalSalesViews');
        return messages('common.viewCount');
    }, [isRevenueUsd, isUsage, messages]);

    const pieData = useMemo(() => {
        if (isRevenueMetric) {
            if (viewType === ANALYTICS_BAR_CHART_TYPE.DSP) {
                return revenueDspBarChartData.map((item) => ({
                    type: item.dspName,
                    value: isUsage ? item.quantity : item.revenueUsd,
                    imageUrl: item.imageUrl,
                }));
            } else {
                return revenueTerBarChartData.map((item) => ({
                    type: item.territory,
                    value: isUsage
                        ? (item.quantity ?? item.revenueUsd)
                        : item.revenueUsd,
                }));
            }
        }

        if (viewType === ANALYTICS_BAR_CHART_TYPE.DSP) {
            return dspTrendViewData.map((item) => ({
                type: item.dspName,
                value: item.totalViews,
                imageUrl: item.imageUrl,
            }));
        } else {
            return terTrendViewData.map((item) => ({
                type: item.territory,
                value: item.totalViews,
            }));
        }
    }, [
        isRevenueMetric,
        isUsage,
        viewType,
        revenueDspBarChartData,
        revenueTerBarChartData,
        dspTrendViewData,
        terTrendViewData,
    ]);

    const isBarChartFetching = isRevenueMetric
        ? viewType === ANALYTICS_BAR_CHART_TYPE.DSP
            ? isDspRevenueFetching
            : isTerRevenueFetching
        : viewType === ANALYTICS_BAR_CHART_TYPE.DSP
          ? isDspTrendViewFetching
          : isTerTrendViewFetching;

    return (
        <Row>
            <Col xs={24} lg={16}>
                <LineChartView
                    title={''}
                    data={lineChartData}
                    xAxisKey="period"
                    lineKey={lineKey}
                    lineName={lineName}
                    loading={isLineChartFetching}
                    chartHeight={250}
                    className="!rounded-none !border-0 !border-r !shadow-none"
                />
            </Col>
            <Col xs={24} lg={8}>
                <PieChartView
                    title={
                        <div className="flex w-full items-center justify-end">
                            <Segmented
                                options={[
                                    {
                                        label: 'DSP',
                                        value: ANALYTICS_BAR_CHART_TYPE.DSP,
                                    },
                                    {
                                        label: messages('country.label'),
                                        value: ANALYTICS_BAR_CHART_TYPE.TERRITORY,
                                    },
                                ]}
                                value={viewType}
                                onChange={(val) =>
                                    setViewType(val as ANALYTICS_BAR_CHART_TYPE)
                                }
                                className="flex-shrink-0"
                            />
                        </div>
                    }
                    data={pieData}
                    loading={isBarChartFetching}
                    legendPosition="right"
                    chartHeight={200}
                    className="!rounded-none !border-none !shadow-none"
                />
            </Col>
        </Row>
    );
}
