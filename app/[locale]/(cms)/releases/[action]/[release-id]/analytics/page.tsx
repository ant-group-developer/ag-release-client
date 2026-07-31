'use client';

import DateSelect2 from '@/components/ui/select/date-select2';
import { PATH_PARAMS } from '@/enums/routes';
import { formattedNumber } from '@/helpers/common';
import dayjs from 'dayjs';
import { DollarSign, Eye, Music } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import ReleaseAnalyticsOverviewChart from '@/modules/analytics2/components/chart/release-analytics-overview-chart';
import MetricHeaderTabs, {
    MetricHeaderTabItem,
} from '@/modules/analytics2/components/metric-header-tabs';
import { ANALYTICS_METRIC_KEY } from '@/modules/analytics2/enums';
import { useGetReleaseSummary } from '@/modules/analytics2/hooks/use-get-release-summary';

const ANALYTICS_DEFAULT_RANGE_MONTHS = 12;

export default function AnalyticsPage() {
    const messages = useTranslations();
    const params = useParams();
    const releaseId = params[PATH_PARAMS.RELEASE_ID]
        ? `${params[PATH_PARAMS.RELEASE_ID]}`
        : '';

    const [activeMetric, setActiveMetric] = useState<string>(
        ANALYTICS_METRIC_KEY.TOTAL_VIEWS
    );

    const handleMetricChange = (key: string) => {
        setActiveMetric(key);
    };

    const [fromDate, setFromDate] = useState<string>(
        dayjs()
            .subtract(ANALYTICS_DEFAULT_RANGE_MONTHS, 'month')
            .format('YYYY-MM-DD')
    );
    const [toDate, setToDate] = useState<string>(dayjs().format('YYYY-MM-DD'));

    const isEnabled = !!releaseId;

    // Gọi API lấy thông tin tổng quan summary của Release
    const { releaseSummaryData } = useGetReleaseSummary(
        releaseId,
        { fromDate, toDate },
        isEnabled
    );

    const metricTabItems: MetricHeaderTabItem[] = [
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
            label: messages('analytics.totalTrendViews'),
            value: formattedNumber(releaseSummaryData?.totalTrendViews),
            icon: Eye,
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-100/50 dark:bg-emerald-900/30',
        },
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_USAGE,
            label: messages('analytics.revenue.totalUsage'),
            value: formattedNumber(releaseSummaryData?.totalUsage),
            icon: Music,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100/50 dark:bg-purple-900/30',
        },
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD,
            label: messages('analytics.totalRevenueUsd'),
            value: formattedNumber(releaseSummaryData?.totalRevenueUsd),
            icon: DollarSign,
            color: 'text-cyan-600 dark:text-cyan-400',
            bgColor: 'bg-cyan-100/50 dark:bg-cyan-900/30',
        },
    ];

    return (
        <div className="space-y-6 py-4">
            <div className="flex justify-end">
                <DateSelect2
                    style={{ width: 240, height: 32 }}
                    value={`${fromDate},${toDate}`}
                    onChange={(value) => {
                        const [start, end] = value.toString().split(',');
                        setFromDate(start);
                        setToDate(end);
                    }}
                    picker="date"
                />
            </div>

            <div className="mb-6 flex flex-col overflow-hidden rounded-lg border">
                <MetricHeaderTabs
                    items={metricTabItems}
                    activeKey={activeMetric}
                    onChangeKey={handleMetricChange}
                />
                <ReleaseAnalyticsOverviewChart
                    releaseId={releaseId}
                    fromDate={fromDate}
                    toDate={toDate}
                    activeMetric={activeMetric}
                    enabled={isEnabled}
                />
            </div>
        </div>
    );
}
