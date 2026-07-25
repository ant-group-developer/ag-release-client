'use client';

import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import DateSelect2 from '@/components/ui/select/date-select2';
import { formattedNumber } from '@/helpers/common';
import { Space, Tag } from 'antd';
import { DollarSign, Eye, Music } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { ANALYTICS_METRIC_KEY, ANALYTICS_RELEASE_TYPE } from '../../enums';
import { useGetReleaseOverview } from '../../hooks/use-get-release-overview';
import ReleaseAnalyticsOverviewChart from '../chart/release-analytics-overview-chart';
import MetricHeaderTabs, { MetricHeaderTabItem } from '../metric-header-tabs';
import DetailReleaseRankings from './detail-release-rankings';

interface DetailReleaseAnalyticsModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    releaseId: string;
    fromDate: string;
    toDate: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function DetailReleaseAnalyticsModal({
    open,
    onClose,
    title,
    releaseId,
    fromDate,
    toDate,
    releaseType,
}: DetailReleaseAnalyticsModalProps) {
    const messages = useTranslations();

    const [localFromDate, setLocalFromDate] = useState(fromDate);
    const [localToDate, setLocalToDate] = useState(toDate);

    // Đồng bộ lại ngày từ component cha khi mở modal
    useEffect(() => {
        if (open) {
            setLocalFromDate(fromDate);
            setLocalToDate(toDate);
        }
    }, [open, fromDate, toDate]);

    // Gọi API lấy thông tin tổng quan summary của Release
    const { overviewData, isFetching } = useGetReleaseOverview(releaseId, {
        fromDate: localFromDate,
        toDate: localToDate,
        releaseType,
    });

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
                    <Space>
                        <Tag className="!mr-0 !px-2 !py-1" color="green">
                            {messages('common.release')}
                        </Tag>
                        <span className="">{`${messages('common.release')}: ${title}`}</span>
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
                    <ReleaseAnalyticsOverviewChart
                        releaseId={releaseId}
                        fromDate={localFromDate}
                        toDate={localToDate}
                        releaseType={releaseType}
                        activeMetric={activeMetric}
                        enabled={open}
                    />
                </div>

                <DetailReleaseRankings
                    releaseId={releaseId}
                    fromDate={localFromDate}
                    toDate={localToDate}
                    releaseType={releaseType}
                    enabled={open}
                />
            </div>
        </FullScreenModal>
    );
}
