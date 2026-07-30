import { Col, Row, Segmented } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { ANALYTICS_BAR_CHART_TYPE, ANALYTICS_METRIC_KEY } from '../../enums';
import LineChartView from './line-chart-view';
import PieChartView from './pie-chart-view';

export interface AnalyticsOverviewChartProps {
    activeMetric?: string;
    lineChartData?: any[];
    isLineChartLoading?: boolean;
    dspData?: any[];
    terData?: any[];
    isBarChartLoading?: boolean;
    showSegment?: boolean;
    defaultBarChartType?: ANALYTICS_BAR_CHART_TYPE;
}

export default function AnalyticsOverviewChart({
    activeMetric = ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
    lineChartData = [],
    isLineChartLoading = false,
    dspData = [],
    terData = [],
    isBarChartLoading = false,
    showSegment = true,
    defaultBarChartType = ANALYTICS_BAR_CHART_TYPE.DSP,
}: AnalyticsOverviewChartProps) {
    const messages = useTranslations();
    const [viewType, setViewType] =
        useState<ANALYTICS_BAR_CHART_TYPE>(defaultBarChartType);

    useEffect(() => {
        setViewType(defaultBarChartType);
    }, [defaultBarChartType]);

    const isRevenueMetric =
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_USAGE ||
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD;
    const isUsage = activeMetric === ANALYTICS_METRIC_KEY.TOTAL_USAGE;
    const isRevenueUsd =
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD;

    const lineKey = useMemo(() => {
        if (isRevenueUsd) return 'revenueUsd';
        if (isUsage) return 'quantity';
        return 'totalViews';
    }, [isRevenueUsd, isUsage]);

    const lineName = useMemo(() => {
        if (isRevenueUsd) return messages('analytics.totalRevenueUsd');
        if (isUsage) return messages('analytics.totalSalesViews');
        return messages('common.streams');
    }, [isRevenueUsd, isUsage, messages]);

    const pieData = useMemo(() => {
        const sourceData =
            viewType === ANALYTICS_BAR_CHART_TYPE.DSP ? dspData : terData;
        if (!sourceData || !Array.isArray(sourceData)) return [];

        return sourceData.map((item: any) => {
            const type =
                viewType === ANALYTICS_BAR_CHART_TYPE.DSP
                    ? item.dspName || item.tenantName || item.name || ''
                    : item.territory || item.country || '';
            let val = 0;
            if (isRevenueUsd) {
                val = item.revenueUsd ?? item.totalRevenueUsd ?? 0;
            } else if (isUsage) {
                val = item.quantity ?? item.totalUsage ?? item.revenueUsd ?? 0;
            } else {
                val = item.totalViews ?? item.views ?? 0;
            }
            return {
                type,
                value: typeof val === 'string' ? parseFloat(val) || 0 : val,
                imageUrl: item.imageUrl,
            };
        });
    }, [viewType, dspData, terData, isRevenueUsd, isUsage]);

    return (
        <Row>
            <Col xs={24} lg={16}>
                <LineChartView
                    title={''}
                    data={lineChartData}
                    xAxisKey="period"
                    lineKey={lineKey}
                    lineName={lineName}
                    loading={isLineChartLoading}
                    chartHeight={250}
                    className="!rounded-none !border-0 !border-r !shadow-none"
                />
            </Col>
            <Col xs={24} lg={8}>
                <PieChartView
                    title={
                        showSegment ? (
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
                                        setViewType(
                                            val as ANALYTICS_BAR_CHART_TYPE
                                        )
                                    }
                                    className="flex-shrink-0"
                                />
                            </div>
                        ) : null
                    }
                    data={pieData}
                    loading={isBarChartLoading}
                    legendPosition="right"
                    chartHeight={200}
                    className="!rounded-none !border-none !shadow-none"
                />
            </Col>
        </Row>
    );
}
