'use client';

import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import DateSelect2 from '@/components/ui/select/date-select2';
import { Col, Row } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useGetTrackDspDailyTimeline } from '../../hooks/use-get-track-dsp-daily-timeline';
import { useGetTrackDspSalesTimeline } from '../../hooks/use-get-track-dsp-sales-timeline';
import { useGetTrackDspTimeline } from '../../hooks/use-get-track-dsp-timeline';
import { useGetTrackOverview } from '../../hooks/use-get-track-overview';
import { useGetTrackRevenueTimeline } from '../../hooks/use-get-track-revenue-timeline';
import DetailDspTimelineChart from '../detail/detail-dsp-timeline-chart';
import DetailRevenueTimelineChart from '../detail/detail-revenue-timeline-chart';
import DetailStatsOverview from '../detail/detail-stats-overview';

interface DetailTrackAnalyticsModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    isrc: string;
    fromDate: string;
    toDate: string;
}

export default function DetailTrackAnalyticsModal({
    open,
    onClose,
    title,
    isrc,
    fromDate,
    toDate,
}: DetailTrackAnalyticsModalProps) {
    const messages = useTranslations();

    const [localFromDate, setLocalFromDate] = useState(fromDate);
    const [localToDate, setLocalToDate] = useState(toDate);
    const [range, setRange] = useState<number>(30);

    // Đồng bộ lại ngày từ component cha khi mở modal
    useEffect(() => {
        if (open) {
            setLocalFromDate(fromDate);
            setLocalToDate(toDate);
        }
    }, [open, fromDate, toDate]);

    // Gọi API lấy thông tin tổng quan của Track
    const { overviewData, isFetching } = useGetTrackOverview(
        isrc,
        { fromDate: localFromDate, toDate: localToDate },
        open
    );

    // 1. Gọi API lấy thông tin xu hướng theo thời gian (Monthly) của Track
    const { timelineData: trendTimelineData, isFetching: isTrendFetching } =
        useGetTrackDspTimeline(
            isrc,
            {
                fromDate: localFromDate,
                toDate: localToDate,
                topN: 5,
                includeOther: true,
            },
            open
        );

    // 2. Gọi API lấy thông tin doanh số theo thời gian (Monthly) của Track
    const { timelineData: salesTimelineData, isFetching: isSalesFetching } =
        useGetTrackDspSalesTimeline(
            isrc,
            {
                fromDate: localFromDate,
                toDate: localToDate,
                topN: 5,
                includeOther: true,
            },
            open
        );

    // 3. Gọi API lấy thông tin xu hướng theo thời gian (Daily) của Track
    const toDateDaily = useMemo(() => dayjs().format('YYYY-MM-DD'), []);
    const fromDateDaily = useMemo(() => {
        return dayjs()
            .subtract(range - 1, 'day')
            .format('YYYY-MM-DD');
    }, [range]);

    const { timelineData: dailyTimelineData, isFetching: isDailyFetching } =
        useGetTrackDspDailyTimeline(
            isrc,
            {
                fromDate: fromDateDaily,
                toDate: toDateDaily,
                topN: 5,
                includeOther: true,
            },
            open
        );

    // 4. Gọi API lấy thông tin doanh thu theo thời gian của Track
    const { timelineData: revenueTimelineData, isFetching: isRevenueFetching } =
        useGetTrackRevenueTimeline(
            isrc,
            {
                fromDate: localFromDate,
                toDate: localToDate,
                topN: 5,
                includeOther: true,
            },
            open
        );

    return (
        <FullScreenModal
            title={
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-md font-bold text-gray-900 dark:text-zinc-100">
                            {messages('analytics.detailTitle')}
                        </span>
                        <span className="text-xs font-normal text-gray-400 dark:text-zinc-500">
                            {messages('analytics2.detailEntityTitle', {
                                entity: messages('common.track'),
                                title,
                            })}
                        </span>
                    </div>
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
            }
            open={open}
            onCancel={onClose}
            footer={null}
        >
            <div className="space-y-6 p-6">
                {/* 1. Phần overview 3 card */}
                <DetailStatsOverview
                    trendViews={overviewData?.totalTrendViews}
                    salesViews={overviewData?.totalSalesViews}
                    revenueUsd={overviewData?.totalRevenueUsd}
                    isLoading={isFetching}
                />

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12} className="flex">
                        {/* 2. Biểu đồ xu hướng theo DSP */}
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
                        {/* 3. Biểu đồ doanh thu theo thời gian */}
                        <DetailRevenueTimelineChart
                            revenueTimelineData={revenueTimelineData}
                            isRevenueFetching={isRevenueFetching}
                        />
                    </Col>
                </Row>
            </div>
        </FullScreenModal>
    );
}
