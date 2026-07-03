import StatsOverview from '@/modules/dashboard/components/stats-overview';
import { Col, Row, Segmented } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useGetTrendViewDspBarChart } from '../../hooks/use-get-trend-view-dsp-bar-chart';
import { useGetTrendViewLineChart } from '../../hooks/use-get-trend-view-line-chart';
import { useGetTrendViewTerBarChart } from '../../hooks/use-get-trend-view-ter-bar-chart';
import LineChartView from '../chart/line-chart-view';
import PieChartView from '../chart/pie-chart-view';
import AnalyticsRankings from '../ranking/analytics-rankings';

interface Props {
    fromDate: string;
    toDate: string;
}

export default function PlaysTabContent({ fromDate, toDate }: Props) {
    const messages = useTranslations();
    const [viewType, setViewType] = useState<'dsp' | 'ter'>('dsp');

    const { lineChartData, isFetching: isLineChartFetching } =
        useGetTrendViewLineChart({
            fromDate,
            toDate,
        });

    const { barChartData: dspBarChartData, isFetching: isDspBarChartFetching } =
        useGetTrendViewDspBarChart(
            {
                fromDate,
                toDate,
            },
            { enabled: viewType === 'dsp' }
        );

    const { barChartData: terBarChartData, isFetching: isTerBarChartFetching } =
        useGetTrendViewTerBarChart(
            {
                fromDate,
                toDate,
            },
            { enabled: viewType === 'ter' }
        );

    const mappedPieData = useMemo(() => {
        if (viewType === 'dsp') {
            return dspBarChartData.map((item) => ({
                type: item.dspName,
                value: item.totalViews,
            }));
        } else {
            return terBarChartData.map((item) => ({
                type: item.territory,
                value: item.totalViews,
            }));
        }
    }, [viewType, dspBarChartData, terBarChartData]);

    const isBarChartFetching =
        viewType === 'dsp' ? isDspBarChartFetching : isTerBarChartFetching;

    return (
        <>
            {/* <MetricCards fromDate={fromDate} toDate={toDate} /> */}

            <StatsOverview params={{ startDate: fromDate, endDate: toDate }} />

            {/* <PlaysTimelineChart fromDate={fromDate} toDate={toDate} /> */}

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={15}>
                    <LineChartView
                        title={messages('analytics.trendViewsByMonth')}
                        data={lineChartData}
                        xAxisKey="period"
                        lineKey="totalViews"
                        lineName={messages('common.viewCount')}
                        loading={isLineChartFetching}
                        chartHeight={250}
                    />
                </Col>
                <Col xs={24} lg={9}>
                    <PieChartView
                        title={
                            <div className="flex w-full items-center justify-between">
                                <span className="text-base font-bold">
                                    {messages('analytics.viewsDistribution')}
                                </span>
                                <Segmented
                                    options={[
                                        {
                                            label: 'DSP',
                                            value: 'dsp',
                                        },
                                        {
                                            label: messages('country.label'),
                                            value: 'ter',
                                        },
                                    ]}
                                    value={viewType}
                                    onChange={(val) =>
                                        setViewType(val as 'dsp' | 'ter')
                                    }
                                    className="flex-shrink-0"
                                />
                            </div>
                        }
                        data={mappedPieData}
                        loading={isBarChartFetching}
                        legendPosition="right"
                        chartHeight={200}
                    />
                </Col>
            </Row>

            {/* <AnalyticsDailyChart /> */}
            <AnalyticsRankings fromDate={fromDate} toDate={toDate} />
            {/* <RecentReleasesTable fromDate={fromDate} toDate={toDate} /> */}
        </>
    );
}
