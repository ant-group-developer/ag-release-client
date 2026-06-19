'use client';

import DetailDspTimelineChart from '@/modules/analytics2/components/detail/detail-dsp-timeline-chart';
import DetailRevenueTimelineChart from '@/modules/analytics2/components/detail/detail-revenue-timeline-chart';
import DetailStatsOverview from '@/modules/analytics2/components/detail/detail-stats-overview';
import { useGetReleaseDspDailyTimeline } from '@/modules/analytics2/hooks/use-get-release-dsp-daily-timeline';
import { useGetReleaseDspSalesTimeline } from '@/modules/analytics2/hooks/use-get-release-dsp-sales-timeline';
import { useGetReleaseDspTimeline } from '@/modules/analytics2/hooks/use-get-release-dsp-timeline';
import { useGetReleaseOverview } from '@/modules/analytics2/hooks/use-get-release-overview';
import { useGetReleaseRevenueTimeline } from '@/modules/analytics2/hooks/use-get-release-revenue-timeline';
import { Col, Row } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';

type Props = {
    releaseId: string;
};

const ANALYTICS_DEFAULT_RANGE_DAYS = 30;
const ANALYTICS_MONTHLY_RANGE_DAYS = 29;
const ANALYTICS_TOP_DSP_COUNT = 5;
const ANALYTICS_INCLUDE_OTHER_DSP = true;

export default function AnalyticsTab({ releaseId }: Props) {
    const [range, setRange] = useState<number>(ANALYTICS_DEFAULT_RANGE_DAYS);

    const toDate = useMemo(() => dayjs().format('YYYY-MM-DD'), []);
    const fromDate = useMemo(
        () =>
            dayjs()
                .subtract(ANALYTICS_MONTHLY_RANGE_DAYS, 'day')
                .format('YYYY-MM-DD'),
        []
    );
    const toDateDaily = useMemo(() => dayjs().format('YYYY-MM-DD'), []);
    const fromDateDaily = useMemo(
        () =>
            dayjs()
                .subtract(range - 1, 'day')
                .format('YYYY-MM-DD'),
        [range]
    );

    const timelineParams = {
        fromDate,
        toDate,
        topN: ANALYTICS_TOP_DSP_COUNT,
        includeOther: ANALYTICS_INCLUDE_OTHER_DSP,
    };

    const dailyTimelineParams = {
        fromDate: fromDateDaily,
        toDate: toDateDaily,
        topN: ANALYTICS_TOP_DSP_COUNT,
        includeOther: ANALYTICS_INCLUDE_OTHER_DSP,
    };

    const isEnabled = !!releaseId;

    const { overviewData, isFetching: isOverviewFetching } =
        useGetReleaseOverview(releaseId, { fromDate, toDate }, isEnabled);

    const { timelineData: trendTimelineData, isFetching: isTrendFetching } =
        useGetReleaseDspTimeline(releaseId, timelineParams, isEnabled);

    const { timelineData: salesTimelineData, isFetching: isSalesFetching } =
        useGetReleaseDspSalesTimeline(releaseId, timelineParams, isEnabled);

    const { timelineData: dailyTimelineData, isFetching: isDailyFetching } =
        useGetReleaseDspDailyTimeline(
            releaseId,
            dailyTimelineParams,
            isEnabled
        );

    const { timelineData: revenueTimelineData, isFetching: isRevenueFetching } =
        useGetReleaseRevenueTimeline(releaseId, timelineParams, isEnabled);

    return (
        <div className="space-y-6 py-4">
            <DetailStatsOverview
                trendViews={overviewData?.totalTrendViews}
                salesViews={overviewData?.totalSalesViews}
                revenueUsd={overviewData?.totalRevenueUsd}
                isLoading={isOverviewFetching}
            />

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12} className="flex">
                    <DetailDspTimelineChart
                        trendTimelineData={trendTimelineData}
                        isTrendFetching={isTrendFetching}
                        salesTimelineData={salesTimelineData}
                        isSalesFetching={isSalesFetching}
                        dailyTimelineData={dailyTimelineData}
                        isDailyFetching={isDailyFetching}
                        range={range}
                        onRangeChange={setRange}
                    />
                </Col>
                <Col xs={24} lg={12} className="flex">
                    <DetailRevenueTimelineChart
                        revenueTimelineData={revenueTimelineData}
                        isRevenueFetching={isRevenueFetching}
                    />
                </Col>
            </Row>
        </div>
    );
}
