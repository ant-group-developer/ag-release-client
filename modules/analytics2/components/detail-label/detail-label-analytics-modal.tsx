'use client';

import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import DateSelect2 from '@/components/ui/select/date-select2';
import { formattedNumber } from '@/helpers/common';
import { Space, Tag, Typography } from 'antd';
import { DollarSign, Eye, Music } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { ANALYTICS_METRIC_KEY, ANALYTICS_RELEASE_TYPE } from '../../enums';
import { useGetLabelSummary } from '../../hooks/use-get-label-summary';
import LabelAnalyticsOverviewChart from '../chart/label-analytics-overview-chart';
import DetailReleaseAnalyticsModal from '../detail-release/detail-release-analytics-modal';
import DetailTrackAnalyticsModal from '../detail-track/detail-track-analytics-modal';
import MetricHeaderTabs, { MetricHeaderTabItem } from '../metric-header-tabs';
import DetailLabelRankings from './detail-label-rankings';

interface DetailLabelAnalyticsModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    labelId: string;
    fromDate: string;
    toDate: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function DetailLabelAnalyticsModal({
    open,
    onClose,
    title,
    labelId,
    fromDate,
    toDate,
    releaseType,
}: DetailLabelAnalyticsModalProps) {
    const messages = useTranslations();

    const [localFromDate, setLocalFromDate] = useState(fromDate);
    const [localToDate, setLocalToDate] = useState(toDate);

    const [detailReleaseModal, setDetailReleaseModal] = useState<{
        open: boolean;
        title: string;
        releaseId: string;
        upc?: string;
    }>({
        open: false,
        title: '',
        releaseId: '',
    });

    const [detailTrackModal, setDetailTrackModal] = useState<{
        open: boolean;
        title: string;
        isrc: string;
    }>({
        open: false,
        title: '',
        isrc: '',
    });

    // Đồng bộ lại ngày từ component cha khi mở modal
    useEffect(() => {
        if (open) {
            setLocalFromDate(fromDate);
            setLocalToDate(toDate);
        }
    }, [open, fromDate, toDate]);

    // Gọi API lấy thông tin tổng quan summary của Label
    const { labelSummaryData, isFetching } = useGetLabelSummary(
        labelId,
        { fromDate: localFromDate, toDate: localToDate, releaseType },
        open
    );

    const [activeMetric, setActiveMetric] = useState<string>(
        ANALYTICS_METRIC_KEY.TOTAL_VIEWS
    );

    const handleMetricChange = (key: string) => {
        setActiveMetric(key);
    };

    const metricTabItems: MetricHeaderTabItem[] = [
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
            label: messages('analytics.totalTrendViews'),
            value: formattedNumber(labelSummaryData?.totalTrendViews),
            icon: Eye,
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-100/50 dark:bg-emerald-900/30',
        },
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_USAGE,
            label: messages('analytics.revenue.totalUsage'),
            value: formattedNumber(labelSummaryData?.totalUsage),
            icon: Music,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100/50 dark:bg-purple-900/30',
        },
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD,
            label: messages('analytics.totalRevenueUsd'),
            value: formattedNumber(labelSummaryData?.totalRevenueUsd),
            icon: DollarSign,
            color: 'text-cyan-600 dark:text-cyan-400',
            bgColor: 'bg-cyan-100/50 dark:bg-cyan-900/30',
        },
    ];

    return (
        <FullScreenModal
            title={
                <div className="flex w-full items-center justify-between">
                    <Space align="center" size="small">
                        <Tag
                            className="!mr-0 !px-2 !py-0.5 font-medium"
                            color="blue"
                        >
                            {messages('common.label')}
                        </Tag>
                        <Typography.Text strong className="text-base">
                            {title}
                        </Typography.Text>
                    </Space>
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
                        picker="date"
                    />
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
        >
            <div className="space-y-6 p-6">
                <div className="mb-6 flex flex-col overflow-hidden rounded-lg border">
                    <MetricHeaderTabs
                        items={metricTabItems}
                        activeKey={activeMetric}
                        onChangeKey={handleMetricChange}
                    />
                    <LabelAnalyticsOverviewChart
                        labelId={labelId}
                        fromDate={localFromDate}
                        toDate={localToDate}
                        releaseType={releaseType}
                        activeMetric={activeMetric}
                        enabled={open}
                    />
                </div>

                <DetailLabelRankings
                    labelId={labelId}
                    fromDate={localFromDate}
                    toDate={localToDate}
                    releaseType={releaseType}
                    activeMetric={activeMetric}
                    enabled={open}
                    onSelectRelease={(releaseId, relTitle, upc) =>
                        setDetailReleaseModal({
                            open: true,
                            title: relTitle,
                            releaseId,
                            upc,
                        })
                    }
                    onSelectTrack={(isrc, trkTitle) =>
                        setDetailTrackModal({
                            open: true,
                            title: trkTitle,
                            isrc,
                        })
                    }
                />
            </div>

            {detailReleaseModal.open && (
                <DetailReleaseAnalyticsModal
                    open={detailReleaseModal.open}
                    onClose={() =>
                        setDetailReleaseModal((prev) => ({
                            ...prev,
                            open: false,
                        }))
                    }
                    title={detailReleaseModal.title}
                    releaseId={detailReleaseModal.releaseId}
                    upc={detailReleaseModal.upc}
                    fromDate={localFromDate}
                    toDate={localToDate}
                    releaseType={releaseType}
                />
            )}
            {detailTrackModal.open && (
                <DetailTrackAnalyticsModal
                    open={detailTrackModal.open}
                    onClose={() =>
                        setDetailTrackModal((prev) => ({
                            ...prev,
                            open: false,
                        }))
                    }
                    title={detailTrackModal.title}
                    isrc={detailTrackModal.isrc}
                    fromDate={localFromDate}
                    toDate={localToDate}
                    releaseType={releaseType}
                />
            )}
        </FullScreenModal>
    );
}
