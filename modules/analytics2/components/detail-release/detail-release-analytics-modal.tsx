'use client';

import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import DateSelect2 from '@/components/ui/select/date-select2';
import { Col, Row } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useGetReleaseDspDailyTimeline } from '../../hooks/use-get-release-dsp-daily-timeline';
import { useGetReleaseDspSalesTimeline } from '../../hooks/use-get-release-dsp-sales-timeline';
import { useGetReleaseDspTimeline } from '../../hooks/use-get-release-dsp-timeline';
import { useGetReleaseOverview } from '../../hooks/use-get-release-overview';
import { useGetReleaseRevenueTimeline } from '../../hooks/use-get-release-revenue-timeline';
import DetailDspTimelineChart from '../detail/detail-dsp-timeline-chart';
import DetailRevenueTimelineChart from '../detail/detail-revenue-timeline-chart';
import DetailStatsOverview from '../detail/detail-stats-overview';

interface DetailReleaseAnalyticsModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    releaseId: string;
    fromDate: string;
    toDate: string;
}

export default function DetailReleaseAnalyticsModal({
    open,
    onClose,
    title,
    releaseId,
    fromDate,
    toDate,
}: DetailReleaseAnalyticsModalProps) {
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

    // Gọi API lấy thông tin tổng quan của Release
    const { overviewData, isFetching } = useGetReleaseOverview(
        releaseId,
        { fromDate: localFromDate, toDate: localToDate },
        open
    );

    // 1. Gọi API lấy thông tin xu hướng theo thời gian (Monthly) của Release
    const { timelineData: trendTimelineData, isFetching: isTrendFetching } =
        useGetReleaseDspTimeline(
            releaseId,
            {
                fromDate: localFromDate,
                toDate: localToDate,
                topN: 5,
                includeOther: true,
            },
            open
        );

    // 2. Gọi API lấy thông tin doanh số theo thời gian (Monthly) của Release
    const { timelineData: salesTimelineData, isFetching: isSalesFetching } =
        useGetReleaseDspSalesTimeline(
            releaseId,
            {
                fromDate: localFromDate,
                toDate: localToDate,
                topN: 5,
                includeOther: true,
            },
            open
        );

    // 3. Gọi API lấy thông tin xu hướng theo thời gian (Daily) của Release
    const toDateDaily = useMemo(() => dayjs().format('YYYY-MM-DD'), []);
    const fromDateDaily = useMemo(() => {
        return dayjs()
            .subtract(range - 1, 'day')
            .format('YYYY-MM-DD');
    }, [range]);

    const { timelineData: dailyTimelineData, isFetching: isDailyFetching } =
        useGetReleaseDspDailyTimeline(
            releaseId,
            {
                fromDate: fromDateDaily,
                toDate: toDateDaily,
                topN: 5,
                includeOther: true,
            },
            open
        );

    // 4. Gọi API lấy thông tin doanh thu theo thời gian của Release
    const { timelineData: revenueTimelineData, isFetching: isRevenueFetching } =
        useGetReleaseRevenueTimeline(
            releaseId,
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
                                entity: messages('common.release'),
                                title,
                            })}
                        </span>
                    </div>
                    <DateSelect2
                        key="date"
                        rangePickerStyle={{ width: 180, height: 34 }}
                        style={{ width: 180, height: 34 }}
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
