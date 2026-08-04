'use client';

import DateSelect2 from '@/components/ui/select/date-select2';
import { ANALYTICS_METRIC_KEY } from '@/modules/analytics2/enums';
import { Select, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import ContentEntitySelector, { ContentItem } from './content-entity-selector';

interface ControlsSidebarProps {
    fromDate: string;
    toDate: string;
    onDateChange: (fromDate: string, toDate: string) => void;
    activeMetric?: string;
    onMetricChange?: (value: string) => void;
    onContentSelect?: (item?: ContentItem) => void;
    selectedItem?: ContentItem;
    initialType?: ContentItem['type'];
}

export default function ControlsSidebar({
    fromDate,
    toDate,
    onDateChange,
    activeMetric = ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
    onMetricChange,
    onContentSelect,
    selectedItem,
    initialType,
}: ControlsSidebarProps) {
    const messages = useTranslations();

    return (
        <div className="flex min-h-full flex-col space-y-5 border-r border-slate-200 p-6 dark:border-zinc-800">
            {/* Header Controls */}
            <div>
                <Typography.Title level={5} className="!mb-3 !font-semibold">
                    {messages('common.controls')}
                </Typography.Title>
                <ContentEntitySelector
                    fromDate={fromDate}
                    toDate={toDate}
                    selectedItem={selectedItem}
                    initialType={initialType}
                    onSelect={onContentSelect}
                />
            </div>

            {/* Date Select */}
            <div>
                <DateSelect2
                    className="w-full"
                    value={`${fromDate},${toDate}`}
                    onChange={(val) => {
                        const [start, end] = val.split(',');
                        if (start && end) {
                            onDateChange(start, end);
                        }
                    }}
                    picker="date"
                />
            </div>

            {/* Metrics Section */}
            <div className="space-y-1.5">
                <Typography.Text
                    type="secondary"
                    className="text-xs font-medium"
                >
                    {messages('common.metrics')}
                </Typography.Text>
                <Select
                    className="w-full"
                    value={activeMetric}
                    onChange={onMetricChange}
                    options={[
                        {
                            label:
                                messages('analytics.totalTrendViews') ||
                                'Total views',
                            value: ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
                        },
                        {
                            label:
                                messages('analytics.revenue.totalUsage') ||
                                'Total usage',
                            value: ANALYTICS_METRIC_KEY.TOTAL_USAGE,
                        },
                        {
                            label:
                                messages('analytics.totalRevenueUsd') ||
                                'Total revenue (USD)',
                            value: ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD,
                        },
                    ]}
                />
            </div>
        </div>
    );
}
