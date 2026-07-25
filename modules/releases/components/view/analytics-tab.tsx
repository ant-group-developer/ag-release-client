'use client';

import { Col, Row, Select, Typography } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import LineChartView from '@/modules/analytics2/components/chart/line-chart-view';
import PieChartView from '@/modules/analytics2/components/chart/pie-chart-view';
import DetailStatsOverview from '@/modules/analytics2/components/detail/detail-stats-overview';
import { useGetReleaseOverview } from '@/modules/analytics2/hooks/use-get-release-overview';
import { useGetReleaseRevenueDspBarChart } from '@/modules/analytics2/hooks/use-get-release-revenue-dsp-bar-chart';
import { useGetReleaseRevenueLineChart } from '@/modules/analytics2/hooks/use-get-release-revenue-line-chart';
import { useGetReleaseRevenueTerBarChart } from '@/modules/analytics2/hooks/use-get-release-revenue-ter-bar-chart';
import { useGetReleaseTrendViewDspBarChart } from '@/modules/analytics2/hooks/use-get-release-trend-view-dsp-bar-chart';
import { useGetReleaseTrendViewLineChart } from '@/modules/analytics2/hooks/use-get-release-trend-view-line-chart';
import { useGetReleaseTrendViewTerBarChart } from '@/modules/analytics2/hooks/use-get-release-trend-view-ter-bar-chart';

const { Title } = Typography;

type Props = {
    releaseId: string;
};

const ANALYTICS_MONTHLY_RANGE_DAYS = 29;

export default function AnalyticsTab({ releaseId }: Props) {
    const messages = useTranslations();

    const [trendViewType, setTrendViewType] = useState<'dsp' | 'ter'>('dsp');
    const [revenueViewType, setRevenueViewType] = useState<'dsp' | 'ter'>(
        'dsp'
    );

    const toDate = useMemo(() => dayjs().format('YYYY-MM-DD'), []);
    const fromDate = useMemo(
        () =>
            dayjs()
                .subtract(ANALYTICS_MONTHLY_RANGE_DAYS, 'day')
                .format('YYYY-MM-DD'),
        []
    );

    const isEnabled = !!releaseId;

    // Gọi API lấy thông tin tổng quan của Release
    const { overviewData, isFetching: isOverviewFetching } =
        useGetReleaseOverview(releaseId, { fromDate, toDate }, isEnabled);

    // Gọi API lấy thông tin biểu đồ doanh thu của Release
    const { revenueLineChartData, isFetching: isLineChartFetching } =
        useGetReleaseRevenueLineChart(
            releaseId,
            { fromDate, toDate },
            isEnabled
        );

    // Gọi API lấy thông tin biểu đồ lượt nghe của Release
    const {
        lineChartData: trendViewLineChartData,
        isFetching: isTrendViewLineChartFetching,
    } = useGetReleaseTrendViewLineChart(
        releaseId,
        { fromDate, toDate },
        isEnabled
    );

    // Gọi API lấy thông tin phân bố theo DSP của Release
    const {
        dspBarChartData: trendViewDspBarChartData,
        isFetching: isTrendViewDspBarChartFetching,
    } = useGetReleaseTrendViewDspBarChart(
        releaseId,
        { fromDate, toDate },
        isEnabled && trendViewType === 'dsp'
    );

    // Gọi API lấy thông tin phân bố theo quốc gia của Release
    const {
        terBarChartData: trendViewTerBarChartData,
        isFetching: isTrendViewTerBarChartFetching,
    } = useGetReleaseTrendViewTerBarChart(
        releaseId,
        { fromDate, toDate },
        isEnabled && trendViewType === 'ter'
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

    // Gọi API lấy thông tin phân bố doanh thu theo DSP của Release
    const { revenueDspBarChartData, isFetching: isRevenueDspBarChartFetching } =
        useGetReleaseRevenueDspBarChart(
            releaseId,
            { fromDate, toDate },
            isEnabled && revenueViewType === 'dsp'
        );

    // Gọi API lấy thông tin phân bố doanh thu theo quốc gia của Release
    const { revenueTerBarChartData, isFetching: isRevenueTerBarChartFetching } =
        useGetReleaseRevenueTerBarChart(
            releaseId,
            { fromDate, toDate },
            isEnabled && revenueViewType === 'ter'
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
        <div className="space-y-6 py-4">
            <DetailStatsOverview
                trendViews={releaseSummaryData?.totalTrendViews}
                salesViews={releaseSummaryData?.totalUsage}
                revenueUsd={releaseSummaryData?.totalRevenueUsd}
                isLoading={isOverviewFetching}
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
    );
}
