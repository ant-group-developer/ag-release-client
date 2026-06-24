'use client';

import { PAGE_SIZE } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
// import StreamChart from '@/modules/dashboard/components/bar-chart/stream-chart';
import ListRelease from '@/modules/dashboard/components/list-release';
// import MapChart from '@/modules/dashboard/components/map-chart';
import DateSelect2 from '@/components/ui/select/date-select2';
import { DATE_FORMAT } from '@/enums/common';
import LineChartView from '@/modules/analytics2/components/chart/line-chart-view';
import PieChartView from '@/modules/analytics2/components/chart/pie-chart-view';
import AnalyticsRankings from '@/modules/analytics2/components/ranking/analytics-rankings';
import { useGetRevenueDspBarChart } from '@/modules/analytics2/hooks/use-get-revenue-dsp-bar-chart';
import { useGetRevenueLineChart } from '@/modules/analytics2/hooks/use-get-revenue-line-chart';
import { useGetRevenueTerBarChart } from '@/modules/analytics2/hooks/use-get-revenue-ter-bar-chart';
import { useGetTrendViewDspBarChart } from '@/modules/analytics2/hooks/use-get-trend-view-dsp-bar-chart';
import { useGetTrendViewLineChart } from '@/modules/analytics2/hooks/use-get-trend-view-line-chart';
import { useGetTrendViewTerBarChart } from '@/modules/analytics2/hooks/use-get-trend-view-ter-bar-chart';
import StatsOverview from '@/modules/dashboard/components/stats-overview';
import { DashboardDataFilter } from '@/modules/dashboard/types';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { PageContainer } from '@ant-design/pro-components';
import { Col, Row, Select, Typography, theme } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

type Props = {};

function Dashboard({}: Props) {
    // const router = useRouter();
    const { token } = theme.useToken();
    const [startDate] = useState(() =>
        dayjs().subtract(30, 'day').toISOString()
    );
    const [endDate] = useState(() => dayjs().toISOString());

    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<DashboardDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
        startDate,
        endDate,
    });
    const messages = useTranslations();
    const { releasesData, isLoading } = useGetListReleases(dataFilter);

    const fromDate = dataFilter.startDate
        ? dayjs(dataFilter.startDate).format(DATE_FORMAT.MYSQL_TYPE_DATE)
        : '';
    const toDate = dataFilter.endDate
        ? dayjs(dataFilter.endDate).format(DATE_FORMAT.MYSQL_TYPE_DATE)
        : '';

    const [trendViewType, setTrendViewType] = useState<'dsp' | 'ter'>('dsp');
    const [revenueViewType, setRevenueViewType] = useState<'dsp' | 'ter'>(
        'dsp'
    );

    const isEnabled = !!(fromDate && toDate);

    // Gọi API lấy thông tin biểu đồ lượt nghe tổng quan (trend)
    const {
        lineChartData: trendViewLineChartData,
        isFetching: isTrendViewLineChartFetching,
    } = useGetTrendViewLineChart({ fromDate, toDate }, { enabled: isEnabled });

    // Gọi API lấy phân bố lượt nghe theo DSP
    const {
        barChartData: trendViewDspBarChartData,
        isFetching: isTrendViewDspBarChartFetching,
    } = useGetTrendViewDspBarChart(
        { fromDate, toDate },
        { enabled: isEnabled && trendViewType === 'dsp' }
    );

    // Gọi API lấy phân bố lượt nghe theo quốc gia
    const {
        barChartData: trendViewTerBarChartData,
        isFetching: isTrendViewTerBarChartFetching,
    } = useGetTrendViewTerBarChart(
        { fromDate, toDate },
        { enabled: isEnabled && trendViewType === 'ter' }
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

    // Gọi API lấy thông tin biểu đồ doanh thu tổng quan
    const { revenueLineChartData, isFetching: isLineChartFetching } =
        useGetRevenueLineChart({ fromDate, toDate }, { enabled: isEnabled });

    // Gọi API lấy phân bố doanh thu theo DSP
    const { revenueDspBarChartData, isFetching: isRevenueDspBarChartFetching } =
        useGetRevenueDspBarChart(
            { fromDate, toDate },
            { enabled: isEnabled && revenueViewType === 'dsp' }
        );

    // Gọi API lấy phân bố doanh thu theo quốc gia
    const { revenueTerBarChartData, isFetching: isRevenueTerBarChartFetching } =
        useGetRevenueTerBarChart(
            { fromDate, toDate },
            { enabled: isEnabled && revenueViewType === 'ter' }
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
        <div
            style={{
                backgroundColor: token.colorBgLayout,
            }}
        >
            <PageContainer
                title={messages('dashboard.label')}
                extra={
                    <DateSelect2
                        width={240}
                        externalOnChange={(fromDate, toDate) =>
                            onChangeFilter({
                                startDate: fromDate,
                                endDate: toDate,
                            })
                        }
                        value={`${dataFilter.startDate},${dataFilter.endDate}`}
                        picker="month"
                    />
                }
            >
                {/* <DashboardHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                /> */}

                <div className="flex flex-col gap-4">
                    <StatsOverview params={dataFilter} />

                    <ListRelease
                        data={releasesData.items.slice(0, 10)}
                        loading={isLoading}
                    />

                    {/* <DistributionRow
                        startDate={
                            dataFilter.startDate
                                ? dayjs(dataFilter.startDate).format(
                                      DATE_FORMAT.MYSQL_TYPE_DATE
                                  )
                                : undefined
                        }
                        endDate={
                            dataFilter.endDate
                                ? dayjs(dataFilter.endDate).format(
                                      DATE_FORMAT.MYSQL_TYPE_DATE
                                  )
                                : undefined
                        }
                    /> */}

                    {/* <DashboardAnalyticsRow
                        startDate={dataFilter.startDate}
                        endDate={dataFilter.endDate}
                    />  */}

                    {/* <Row gutter={16} align="stretch"> */}
                    {/* <Col span={12}>
                            <ListTop />
                        </Col> */}
                    {/* <Col span={12}>
                            <NewUpdatesCard />
                        </Col> */}
                    {/* <Col span={8}>
                            <RecentIssuesCard issuesData={countIssuesData} />
                        </Col> */}
                    {/* </Row> */}

                    {/* <PlaysTimelineChart
                        fromDate={fromDate}
                        toDate={toDate}
                    /> */}

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
                                        onChange={(val) =>
                                            setTrendViewType(val)
                                        }
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
                                lineName={messages(
                                    'analytics.revenue.modeRevenue'
                                )}
                                loading={isLineChartFetching}
                                chartHeight={250}
                                valuePrefix="$"
                                additionalTooltipKeys={[
                                    {
                                        key: 'quantity',
                                        name: messages(
                                            'analytics.revenue.usage'
                                        ),
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
                                        onChange={(val) =>
                                            setRevenueViewType(val)
                                        }
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

                    <AnalyticsRankings fromDate={fromDate} toDate={toDate} />
                </div>

                {/* <ListNews /> */}
            </PageContainer>
        </div>
    );
}

export default Dashboard;
