'use client';

import { SIZE_ICON } from '@/constants/common';
import { ORDER } from '@/enums/common';
import ListRelease from '@/modules/dashboard/components/list-release';

import StatItem from '@/modules/labels/components/label-detail/overview/card/stat-item';
import { useGetDetailLabel } from '@/modules/labels/hooks/use-get-detail-label';
import { RELEASES_STATUS, RELEASES_TABLE_KEY } from '@/modules/releases/enums';

import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { Col, Row, Select, theme, Typography } from 'antd';
import dayjs from 'dayjs';
import { Disc2, DiscAlbum } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import DateSelect2 from '@/components/ui/select/date-select2';
import LineChartView from '@/modules/analytics2/components/chart/line-chart-view';
import PieChartView from '@/modules/analytics2/components/chart/pie-chart-view';
import DetailStatsOverview from '@/modules/analytics2/components/detail/detail-stats-overview';
import { useGetLabelOverview } from '@/modules/analytics2/hooks/use-get-label-overview';
import { useGetLabelRevenueDspBarChart } from '@/modules/analytics2/hooks/use-get-label-revenue-dsp-bar-chart';
import { useGetLabelRevenueLineChart } from '@/modules/analytics2/hooks/use-get-label-revenue-line-chart';
import { useGetLabelRevenueTerBarChart } from '@/modules/analytics2/hooks/use-get-label-revenue-ter-bar-chart';
import { useGetLabelTrendViewDspBarChart } from '@/modules/analytics2/hooks/use-get-label-trend-view-dsp-bar-chart';
import { useGetLabelTrendViewLineChart } from '@/modules/analytics2/hooks/use-get-label-trend-view-line-chart';
import { useGetLabelTrendViewTerBarChart } from '@/modules/analytics2/hooks/use-get-label-trend-view-ter-bar-chart';

type Props = {};

export default function Overview({}: Props) {
    // Router - params
    const params = useParams();
    const labelId = params['label-id'];

    const messages = useTranslations();
    const { releasesData, isLoading: isReleasesLoading } = useGetListReleases({
        labelId: labelId as string,
        status: RELEASES_STATUS.DISTRIBUTED,
        orderBy: ORDER.DESC,
        fieldOrder: RELEASES_TABLE_KEY.RELEASE_DATE,
    });
    const { token } = theme.useToken();
    const statStyles = {
        backgroundColor: token.colorBgContainer,
    };
    const { labelData, isLoading, error } = useGetDetailLabel(
        labelId as string
    );

    const defaultFromDate = useMemo(
        () => dayjs().subtract(29, 'day').format('YYYY-MM-DD'),
        []
    );
    const defaultToDate = useMemo(() => dayjs().format('YYYY-MM-DD'), []);

    const [localFromDate, setLocalFromDate] = useState(defaultFromDate);
    const [localToDate, setLocalToDate] = useState(defaultToDate);
    const [trendViewType, setTrendViewType] = useState<'dsp' | 'ter'>('dsp');
    const [revenueViewType, setRevenueViewType] = useState<'dsp' | 'ter'>(
        'dsp'
    );

    // Gọi API lấy thông tin tổng quan của Label
    const { overviewData, isFetching: isOverviewFetching } =
        useGetLabelOverview(
            labelId as string,
            { fromDate: localFromDate, toDate: localToDate },
            !!labelId
        );

    // Gọi API lấy thông tin biểu đồ doanh thu của Label
    const { revenueLineChartData, isFetching: isLineChartFetching } =
        useGetLabelRevenueLineChart(
            labelId as string,
            { fromDate: localFromDate, toDate: localToDate },
            !!labelId
        );

    // Gọi API lấy thông tin biểu đồ lượt nghe của Label
    const {
        lineChartData: trendViewLineChartData,
        isFetching: isTrendViewLineChartFetching,
    } = useGetLabelTrendViewLineChart(
        labelId as string,
        { fromDate: localFromDate, toDate: localToDate },
        !!labelId
    );

    // Gọi API lấy thông tin phân bố theo DSP của Label
    const {
        dspBarChartData: trendViewDspBarChartData,
        isFetching: isTrendViewDspBarChartFetching,
    } = useGetLabelTrendViewDspBarChart(
        labelId as string,
        { fromDate: localFromDate, toDate: localToDate },
        !!labelId && trendViewType === 'dsp'
    );

    // Gọi API lấy thông tin phân bố theo quốc gia của Label
    const {
        terBarChartData: trendViewTerBarChartData,
        isFetching: isTrendViewTerBarChartFetching,
    } = useGetLabelTrendViewTerBarChart(
        labelId as string,
        { fromDate: localFromDate, toDate: localToDate },
        !!labelId && trendViewType === 'ter'
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
            labelId as string,
            { fromDate: localFromDate, toDate: localToDate },
            !!labelId && revenueViewType === 'dsp'
        );

    // Gọi API lấy thông tin phân bố doanh thu theo quốc gia của Label
    const { revenueTerBarChartData, isFetching: isRevenueTerBarChartFetching } =
        useGetLabelRevenueTerBarChart(
            labelId as string,
            { fromDate: localFromDate, toDate: localToDate },
            !!labelId && revenueViewType === 'ter'
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
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <StatItem
                    iconBgColor="bg-green-50"
                    title={messages('release.count')}
                    value={labelData?.releaseCount}
                    icon={
                        <DiscAlbum
                            size={SIZE_ICON}
                            className="text-green-500"
                        />
                    }
                    style={statStyles}
                />

                <StatItem
                    iconBgColor="bg-blue-50"
                    title={messages('track.count')}
                    value={labelData?.trackCount}
                    icon={<Disc2 size={SIZE_ICON} className="text-blue-500" />}
                    style={statStyles}
                />
            </div>

            <div className="mt-6 flex w-full items-center justify-between">
                <span className="text-base font-bold text-gray-900 dark:text-zinc-100">
                    {messages('analytics.detailTitle')}
                </span>
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

            <DetailStatsOverview
                trendViews={overviewData?.totalTrendViews}
                salesViews={overviewData?.totalSalesViews}
                revenueUsd={overviewData?.totalRevenueUsd}
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

            <div>
                <ListRelease
                    data={releasesData?.items?.slice(0, 7) ?? []}
                    loading={isReleasesLoading}
                />
            </div>
        </div>
    );
}
