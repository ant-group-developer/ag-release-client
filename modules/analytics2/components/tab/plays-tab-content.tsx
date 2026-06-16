import StatsOverview from '@/modules/dashboard/components/stats-overview';
import { Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useGetTrendViewDspBarChart } from '../../hooks/use-get-trend-view-dsp-bar-chart';
import { useGetTrendViewLineChart } from '../../hooks/use-get-trend-view-line-chart';
import LineChartView from '../chart/line-chart-view';
import PieChartView from '../chart/pie-chart-view';
import AnalyticsRankings from '../ranking/analytics-rankings';

interface Props {
    fromDate: string;
    toDate: string;
}

export default function PlaysTabContent({ fromDate, toDate }: Props) {
    const messages = useTranslations();
    // const {
    //     dataFilter,
    //     onChangeFilter,
    //     onChangePage,
    //     canClearFilter,
    //     removeFilter,
    // } = useFilter<any>({
    //     page: 1,
    //     startDate: fromDate,
    //     endDate: toDate,
    // });

    const { lineChartData, isFetching: isLineChartFetching } =
        useGetTrendViewLineChart({
            fromDate,
            toDate,
        });

    const { barChartData, isFetching: isBarChartFetching } =
        useGetTrendViewDspBarChart({
            fromDate,
            toDate,
        });

    const mappedPieData = useMemo(() => {
        return barChartData.map((item) => ({
            type: item.dspName,
            value: item.totalViews,
        }));
    }, [barChartData]);

    return (
        <>
            {/* <MetricCards fromDate={fromDate} toDate={toDate} /> */}

            <StatsOverview params={{ startDate: fromDate, endDate: toDate }} />

            {/* <PlaysTimelineChart fromDate={fromDate} toDate={toDate} /> */}

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={15}>
                    <LineChartView
                        title={messages('analytics.totalTrendViews')}
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
                        title={messages('analytics.dspDistribution')}
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
