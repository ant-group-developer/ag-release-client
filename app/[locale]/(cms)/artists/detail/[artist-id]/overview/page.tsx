'use client';

import { SIZE_ICON } from '@/constants/common';
import { ORDER } from '@/enums/common';
import ArtistProfileCard from '@/modules/artist/components/artist-detail/overview/card/artist-profile';
import StatItem from '@/modules/artist/components/artist-detail/overview/card/stat-item';
import { useGetDetailArtist } from '@/modules/artist/hooks/use-get-detail-artist';
import ListRelease from '@/modules/dashboard/components/list-release';
import { RELEASES_STATUS, RELEASES_TABLE_KEY } from '@/modules/releases/enums';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { Col, Row, Select, theme, Typography } from 'antd';
import dayjs from 'dayjs';
import { DiscAlbum, Music4 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import DateSelect2 from '@/components/ui/select/date-select2';
import LineChartView from '@/modules/analytics2/components/chart/line-chart-view';
import PieChartView from '@/modules/analytics2/components/chart/pie-chart-view';
import DetailStatsOverview from '@/modules/analytics2/components/detail/detail-stats-overview';
import { useGetArtistOverview } from '@/modules/analytics2/hooks/use-get-artist-overview';
import { useGetArtistRevenueDspBarChart } from '@/modules/analytics2/hooks/use-get-artist-revenue-dsp-bar-chart';
import { useGetArtistRevenueLineChart } from '@/modules/analytics2/hooks/use-get-artist-revenue-line-chart';
import { useGetArtistRevenueTerBarChart } from '@/modules/analytics2/hooks/use-get-artist-revenue-ter-bar-chart';
import { useGetArtistTrendViewDspBarChart } from '@/modules/analytics2/hooks/use-get-artist-trend-view-dsp-bar-chart';
import { useGetArtistTrendViewLineChart } from '@/modules/analytics2/hooks/use-get-artist-trend-view-line-chart';
import { useGetArtistTrendViewTerBarChart } from '@/modules/analytics2/hooks/use-get-artist-trend-view-ter-bar-chart';

type Props = {};

export default function Overview({}: Props) {
    const messages = useTranslations();
    const params = useParams();
    const artistId = params['artist-id'];
    const { artistData } = useGetDetailArtist(artistId as string);
    const { releasesData, isLoading } = useGetListReleases(
        {
            artistId: artistId as string,
            status: RELEASES_STATUS.DISTRIBUTED,
            orderBy: ORDER.DESC,
            fieldOrder: RELEASES_TABLE_KEY.RELEASE_DATE,
        },
        {
            enabled: !!artistId,
        }
    );
    const { token } = theme.useToken();
    const statStyles = {
        backgroundColor: token.colorBgContainer,
    };

    const defaultFromDate = useMemo(
        () => dayjs().subtract(12, 'month').format('YYYY-MM-DD'),
        []
    );
    const defaultToDate = useMemo(() => dayjs().format('YYYY-MM-DD'), []);

    const [localFromDate, setLocalFromDate] = useState(defaultFromDate);
    const [localToDate, setLocalToDate] = useState(defaultToDate);
    const [trendViewType, setTrendViewType] = useState<'dsp' | 'ter'>('dsp');
    const [revenueViewType, setRevenueViewType] = useState<'dsp' | 'ter'>(
        'dsp'
    );

    // Gọi API lấy thông tin tổng quan của Artist
    const { overviewData, isFetching: isOverviewFetching } =
        useGetArtistOverview(
            artistId as string,
            { fromDate: localFromDate, toDate: localToDate },
            !!artistId
        );

    // Gọi API lấy thông tin biểu đồ doanh thu của Artist
    const { revenueLineChartData, isFetching: isLineChartFetching } =
        useGetArtistRevenueLineChart(
            artistId as string,
            { fromDate: localFromDate, toDate: localToDate },
            !!artistId
        );

    // Gọi API lấy thông tin biểu đồ lượt nghe của Artist
    const {
        lineChartData: trendViewLineChartData,
        isFetching: isTrendViewLineChartFetching,
    } = useGetArtistTrendViewLineChart(
        artistId as string,
        { fromDate: localFromDate, toDate: localToDate },
        !!artistId
    );

    // Gọi API lấy thông tin phân bố theo DSP của Artist
    const {
        dspBarChartData: trendViewDspBarChartData,
        isFetching: isTrendViewDspBarChartFetching,
    } = useGetArtistTrendViewDspBarChart(
        artistId as string,
        { fromDate: localFromDate, toDate: localToDate },
        !!artistId && trendViewType === 'dsp'
    );

    // Gọi API lấy thông tin phân bố theo quốc gia của Artist
    const {
        terBarChartData: trendViewTerBarChartData,
        isFetching: isTrendViewTerBarChartFetching,
    } = useGetArtistTrendViewTerBarChart(
        artistId as string,
        { fromDate: localFromDate, toDate: localToDate },
        !!artistId && trendViewType === 'ter'
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

    // Gọi API lấy thông tin phân bố doanh thu theo DSP của Artist
    const { revenueDspBarChartData, isFetching: isRevenueDspBarChartFetching } =
        useGetArtistRevenueDspBarChart(
            artistId as string,
            { fromDate: localFromDate, toDate: localToDate },
            !!artistId && revenueViewType === 'dsp'
        );

    // Gọi API lấy thông tin phân bố doanh thu theo quốc gia của Artist
    const { revenueTerBarChartData, isFetching: isRevenueTerBarChartFetching } =
        useGetArtistRevenueTerBarChart(
            artistId as string,
            { fromDate: localFromDate, toDate: localToDate },
            !!artistId && revenueViewType === 'ter'
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
            <div className="grid grid-cols-2 gap-4">
                <StatItem
                    iconBgColor="bg-green-50"
                    title={messages('release.count')}
                    value={artistData?.releaseCount}
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
                    value={artistData?.trackCount}
                    icon={<Music4 size={SIZE_ICON} className="text-blue-500" />}
                    style={statStyles}
                />
            </div>

            <ArtistProfileCard artistData={artistData} />

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
                    loading={isLoading}
                />
            </div>
        </div>
    );
}
