'use client';

import { DATE_FORMAT } from '@/enums/common';
import { Col, Row, Spin } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { CHART_COLORS } from '../../constants/dashboard-data';
import {
    useGetAnalyticArtist,
    useGetAnalyticDsp,
    useGetAnalyticLabel,
} from '../../hooks/use-get-analytic';
import DistributionPieChart from '../pie-chart';

interface Props {
    startDate?: string;
    endDate?: string;
}

export default function DistributionRow({ startDate, endDate }: Props) {
    const messages = useTranslations();

    const fromDate = useMemo(() => {
        return startDate
            ? dayjs(startDate).format(DATE_FORMAT.MYSQL_TYPE_DATE)
            : dayjs().subtract(30, 'day').format(DATE_FORMAT.MYSQL_TYPE_DATE);
    }, [startDate]);

    const toDate = useMemo(() => {
        return endDate
            ? dayjs(endDate).format(DATE_FORMAT.MYSQL_TYPE_DATE)
            : dayjs().format(DATE_FORMAT.MYSQL_TYPE_DATE);
    }, [endDate]);

    const streamParams = useMemo(
        () => ({
            fromDate,
            toDate,
            topN: 5,
            includeOther: true,
            type: 'stream' as const,
        }),
        [fromDate, toDate]
    );

    const revenueParams = useMemo(
        () => ({
            fromDate,
            toDate,
            topN: 5,
            includeOther: true,
            type: 'revenue' as const,
        }),
        [fromDate, toDate]
    );

    // Call API hooks for DSP
    const { analyticDspData: dspStream, isFetching: isDspStreamLoading } =
        useGetAnalyticDsp(streamParams);
    const { analyticDspData: dspRevenue, isFetching: isDspRevenueLoading } =
        useGetAnalyticDsp(revenueParams);

    // Call API hooks for Label
    const { analyticLabelData: labelStream, isFetching: isLabelStreamLoading } =
        useGetAnalyticLabel(streamParams);
    const {
        analyticLabelData: labelRevenue,
        isFetching: isLabelRevenueLoading,
    } = useGetAnalyticLabel(revenueParams);

    // Call API hooks for Artist
    const {
        analyticArtistData: artistStream,
        isFetching: isArtistStreamLoading,
    } = useGetAnalyticArtist(streamParams);
    const {
        analyticArtistData: artistRevenue,
        isFetching: isArtistRevenueLoading,
    } = useGetAnalyticArtist(revenueParams);

    const mappedDspStream = useMemo(
        () => dspStream.map((item) => ({ type: item.name, value: item.value })),
        [dspStream]
    );
    const mappedDspRevenue = useMemo(
        () =>
            dspRevenue.map((item) => ({ type: item.name, value: item.value })),
        [dspRevenue]
    );

    const mappedLabelStream = useMemo(
        () =>
            labelStream.map((item) => ({ type: item.name, value: item.value })),
        [labelStream]
    );
    const mappedLabelRevenue = useMemo(
        () =>
            labelRevenue.map((item) => ({
                type: item.name,
                value: item.value,
            })),
        [labelRevenue]
    );

    const mappedArtistStream = useMemo(
        () =>
            artistStream.map((item) => ({
                type: item.name,
                value: item.value,
            })),
        [artistStream]
    );
    const mappedArtistRevenue = useMemo(
        () =>
            artistRevenue.map((item) => ({
                type: item.name,
                value: item.value,
            })),
        [artistRevenue]
    );

    const isDspLoading = isDspStreamLoading || isDspRevenueLoading;
    const isLabelLoading = isLabelStreamLoading || isLabelRevenueLoading;
    const isArtistLoading = isArtistStreamLoading || isArtistRevenueLoading;

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
                <Spin spinning={isDspLoading}>
                    <DistributionPieChart
                        title={messages('dashboard.dspChartTitle')}
                        subtitle={messages('dashboard.dspChartSubtitle')}
                        streamData={mappedDspStream}
                        revenueData={mappedDspRevenue}
                        colors={CHART_COLORS}
                    />
                </Spin>
            </Col>
            <Col xs={24} md={8}>
                <Spin spinning={isLabelLoading}>
                    <DistributionPieChart
                        title={messages('dashboard.labelChartTitle')}
                        subtitle={messages('dashboard.labelChartSubtitle')}
                        streamData={mappedLabelStream}
                        revenueData={mappedLabelRevenue}
                        colors={CHART_COLORS}
                    />
                </Spin>
            </Col>
            <Col xs={24} md={8}>
                <Spin spinning={isArtistLoading}>
                    <DistributionPieChart
                        title={messages('dashboard.artistChartTitle')}
                        subtitle={messages('dashboard.artistChartSubtitle')}
                        streamData={mappedArtistStream}
                        revenueData={mappedArtistRevenue}
                        colors={CHART_COLORS}
                    />
                </Spin>
            </Col>
        </Row>
    );
}
