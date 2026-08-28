'use client';

import { Col, Row, Segmented } from 'antd';
import { BarChart3, LineChart, Table } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
    ANALYTICS_BAR_CHART_TYPE,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_OVERVIEW_CHART_MODE,
} from '../../enums';
import { formatDemographicsLabel } from '../../helpers';
import { TrendViewDemographicsBarChartData } from '../../types';
import LineChartView from './line-chart-view';
import OverviewBarChartView from './overview-bar-chart-view';
import OverviewTableView from './overview-table-view';
import PieChartView from './pie-chart-view';

export interface AnalyticsDemographicsContextValue {
    device: TrendViewDemographicsBarChartData;
    gender: TrendViewDemographicsBarChartData;
    age: TrendViewDemographicsBarChartData;
    isFetching: boolean;
}

export const AnalyticsDemographicsContext =
    createContext<AnalyticsDemographicsContextValue | null>(null);

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
    const demographics = useContext(AnalyticsDemographicsContext);
    const [viewType, setViewType] =
        useState<ANALYTICS_BAR_CHART_TYPE>(defaultBarChartType);
    const [overviewChartMode, setOverviewChartMode] =
        useState<ANALYTICS_OVERVIEW_CHART_MODE>(
            ANALYTICS_OVERVIEW_CHART_MODE.LINE
        );

    useEffect(() => {
        setViewType(defaultBarChartType);
    }, [defaultBarChartType]);

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

    const isDemographicsView =
        viewType === ANALYTICS_BAR_CHART_TYPE.DEVICE ||
        viewType === ANALYTICS_BAR_CHART_TYPE.GENDER ||
        viewType === ANALYTICS_BAR_CHART_TYPE.AGE;

    const segmentedOptions = useMemo(() => {
        const extras: { label: string; value: ANALYTICS_BAR_CHART_TYPE }[] = [];

        if (demographics && !isUsage && !isRevenueUsd) {
            if ((demographics.device.items ?? []).length > 0) {
                extras.push({
                    label: messages('analytics2.demographics.device.label'),
                    value: ANALYTICS_BAR_CHART_TYPE.DEVICE,
                });
            }
            if ((demographics.gender.items ?? []).length > 0) {
                extras.push({
                    label: messages('analytics2.demographics.gender.label'),
                    value: ANALYTICS_BAR_CHART_TYPE.GENDER,
                });
            }
            if ((demographics.age.items ?? []).length > 0) {
                extras.push({
                    label: messages('analytics2.demographics.age.label'),
                    value: ANALYTICS_BAR_CHART_TYPE.AGE,
                });
            }
        }

        const countryOption = {
            label: messages('country.label'),
            value: ANALYTICS_BAR_CHART_TYPE.TERRITORY,
        };
        const dspOption = {
            label: 'DSP',
            value: ANALYTICS_BAR_CHART_TYPE.DSP,
        };

        const hasDspData = (dspData?.length ?? 0) > 0;
        const hasTerData = (terData?.length ?? 0) > 0;
        const keepEmptyBaseTabs = !demographics || isBarChartLoading;

        const baseOptions: {
            label: string;
            value: ANALYTICS_BAR_CHART_TYPE;
        }[] = [];

        if (showSegment) {
            if (keepEmptyBaseTabs || hasDspData) {
                baseOptions.push(dspOption);
            }
            if (keepEmptyBaseTabs || hasTerData) {
                baseOptions.push(countryOption);
            }
            return [...baseOptions, ...extras];
        }

        if (extras.length === 0) {
            return [];
        }

        const defaultOption =
            defaultBarChartType === ANALYTICS_BAR_CHART_TYPE.DSP
                ? dspOption
                : countryOption;
        const defaultHasData =
            defaultBarChartType === ANALYTICS_BAR_CHART_TYPE.DSP
                ? hasDspData
                : hasTerData;

        if (keepEmptyBaseTabs || defaultHasData) {
            return [defaultOption, ...extras];
        }

        return extras;
    }, [
        defaultBarChartType,
        demographics,
        dspData,
        isBarChartLoading,
        isRevenueUsd,
        isUsage,
        messages,
        showSegment,
        terData,
    ]);

    const showSwitcher = segmentedOptions.length > 1;

    useEffect(() => {
        if (!segmentedOptions.length) {
            return;
        }

        const values = segmentedOptions.map((option) => option.value);
        if (!values.includes(viewType)) {
            setViewType(values[0]);
        }
    }, [segmentedOptions, viewType]);

    const pieData = useMemo(() => {
        if (isDemographicsView && demographics) {
            const dimension =
                viewType === ANALYTICS_BAR_CHART_TYPE.DEVICE
                    ? 'device'
                    : viewType === ANALYTICS_BAR_CHART_TYPE.GENDER
                      ? 'gender'
                      : 'age';
            const source = demographics[dimension]?.items ?? [];

            return source.map((item) => ({
                type: formatDemographicsLabel(
                    item.dimensionValue,
                    dimension,
                    (key) => messages(key as never)
                ),
                value: item.totalViews,
            }));
        }

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

    const overviewSegmentHeader = (
        <div className="flex w-full items-center justify-end">
            <Segmented
                options={[
                    {
                        label: (
                            <div className="flex items-center gap-1.5 px-0.5">
                                <LineChart className="h-3.5 w-3.5" />
                                <span>
                                    {messages('common.chartLine') || 'Đường'}
                                </span>
                            </div>
                        ),
                        value: ANALYTICS_OVERVIEW_CHART_MODE.LINE,
                    },
                    {
                        label: (
                            <div className="flex items-center gap-1.5 px-0.5">
                                <BarChart3 className="h-3.5 w-3.5" />
                                <span>
                                    {messages('common.chartColumn') || 'Cột'}
                                </span>
                            </div>
                        ),
                        value: ANALYTICS_OVERVIEW_CHART_MODE.COLUMN,
                    },
                    {
                        label: (
                            <div className="flex items-center gap-1.5 px-0.5">
                                <Table className="h-3.5 w-3.5" />
                                <span>
                                    {messages('common.table') || 'Bảng'}
                                </span>
                            </div>
                        ),
                        value: ANALYTICS_OVERVIEW_CHART_MODE.TABLE,
                    },
                ]}
                value={overviewChartMode}
                onChange={(val) =>
                    setOverviewChartMode(val as ANALYTICS_OVERVIEW_CHART_MODE)
                }
                className="flex-shrink-0"
            />
        </div>
    );

    return (
        <Row>
            <Col xs={24} lg={16}>
                {overviewChartMode === ANALYTICS_OVERVIEW_CHART_MODE.LINE ? (
                    <LineChartView
                        title={overviewSegmentHeader}
                        data={lineChartData}
                        xAxisKey="period"
                        lineKey={lineKey}
                        lineName={lineName}
                        loading={isLineChartLoading}
                        chartHeight={250}
                        valuePrefix={isRevenueUsd ? '$' : ''}
                        className="!rounded-none !border-0 !shadow-none lg:!border-r"
                    />
                ) : overviewChartMode ===
                  ANALYTICS_OVERVIEW_CHART_MODE.COLUMN ? (
                    <OverviewBarChartView
                        title={overviewSegmentHeader}
                        data={lineChartData}
                        xAxisKey="period"
                        barKey={lineKey}
                        barName={lineName}
                        loading={isLineChartLoading}
                        chartHeight={250}
                        valuePrefix={isRevenueUsd ? '$' : ''}
                        className="!rounded-none !border-0 !shadow-none lg:!border-r"
                    />
                ) : (
                    <OverviewTableView
                        title={overviewSegmentHeader}
                        data={lineChartData}
                        xAxisKey="period"
                        valueKey={lineKey}
                        valueName={lineName}
                        loading={isLineChartLoading}
                        chartHeight={250}
                        valuePrefix={isRevenueUsd ? '$' : ''}
                        className="!rounded-none !border-0 !shadow-none lg:!border-r"
                    />
                )}
            </Col>
            <Col xs={0} lg={8} className="hidden lg:block">
                <PieChartView
                    title={
                        showSwitcher ? (
                            <div className="flex w-full items-center justify-end">
                                <Segmented
                                    options={segmentedOptions}
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
                    loading={
                        isDemographicsView
                            ? Boolean(demographics?.isFetching)
                            : isBarChartLoading
                    }
                    legendPosition="right"
                    chartHeight={200}
                    className="!rounded-none !border-none !shadow-none"
                />
            </Col>
        </Row>
    );
}
