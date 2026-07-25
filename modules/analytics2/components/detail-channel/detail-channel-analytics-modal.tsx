'use client';

import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import DateSelect2 from '@/components/ui/select/date-select2';
import { formattedNumber } from '@/helpers/common';
import { Space, Tag, Typography } from 'antd';
import { DollarSign, Eye, Music } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { ANALYTICS_METRIC_KEY, ANALYTICS_RELEASE_TYPE } from '../../enums';
import { useGetChannelOverview } from '../../hooks/use-get-channel-overview';
import ChannelAnalyticsOverviewChart from '../chart/channel-analytics-overview-chart';
import DetailReleaseAnalyticsModal from '../detail-release/detail-release-analytics-modal';
import MetricHeaderTabs, { MetricHeaderTabItem } from '../metric-header-tabs';
import DetailChannelRankings from './detail-channel-rankings';

interface DetailChannelAnalyticsModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    channelId: string;
    fromDate: string;
    toDate: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function DetailChannelAnalyticsModal({
    open,
    onClose,
    title,
    channelId,
    fromDate,
    toDate,
    releaseType,
}: DetailChannelAnalyticsModalProps) {
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

    // Đồng bộ lại ngày từ component cha khi mở modal
    useEffect(() => {
        if (open) {
            setLocalFromDate(fromDate);
            setLocalToDate(toDate);
        }
    }, [open, fromDate, toDate]);

    // Gọi API lấy thông tin tổng quan summary của Channel
    const { overviewData, isFetching } = useGetChannelOverview(
        channelId,
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
            label: 'Total views',
            value: formattedNumber(overviewData?.totalTrendViews),
            icon: Eye,
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-100/50 dark:bg-emerald-900/30',
        },
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_USAGE,
            label: 'Total Usage',
            value: formattedNumber(overviewData?.totalSalesViews),
            icon: Music,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100/50 dark:bg-purple-900/30',
        },
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD,
            label: 'Total Revenue',
            value: formattedNumber(overviewData?.totalRevenueUsd),
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
                            color="purple"
                        >
                            {messages('channel.label')}
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
                <div className="mb-6 flex flex-col rounded-lg border">
                    <MetricHeaderTabs
                        items={metricTabItems}
                        activeKey={activeMetric}
                        onChangeKey={handleMetricChange}
                    />
                    <ChannelAnalyticsOverviewChart
                        channelId={channelId}
                        fromDate={localFromDate}
                        toDate={localToDate}
                        releaseType={releaseType}
                        activeMetric={activeMetric}
                        enabled={open}
                    />
                </div>

                <DetailChannelRankings
                    channelId={channelId}
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
        </FullScreenModal>
    );
}
