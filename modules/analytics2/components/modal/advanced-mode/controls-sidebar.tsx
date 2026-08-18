'use client';

import DateSelect2 from '@/components/ui/select/date-select2';
import {
    ANALYTICS_ENTITY_TYPE,
    ANALYTICS_METRIC_KEY,
} from '@/modules/analytics2/enums';
import { AnalyticsEntityType } from '@/modules/analytics2/types';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Radio, Typography } from 'antd';
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
    rankBy?: AnalyticsEntityType;
    onRankByChange?: (rankBy?: AnalyticsEntityType | '') => void;
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
    rankBy,
    onRankByChange,
}: ControlsSidebarProps) {
    const messages = useTranslations();
    const { isAdmin } = useAuth();

    const showRankBy = !!selectedItem?.id;

    const rankByOptions: { label: string; value: AnalyticsEntityType }[] = [
        {
            label: messages('common.releases'),
            value: ANALYTICS_ENTITY_TYPE.RELEASE,
        },
        {
            label: messages('common.tracks'),
            value: ANALYTICS_ENTITY_TYPE.TRACK,
        },
        {
            label: messages('artist.artists'),
            value: ANALYTICS_ENTITY_TYPE.ARTIST,
        },
        {
            label: messages('common.labels'),
            value: ANALYTICS_ENTITY_TYPE.LABEL,
        },
        {
            label: messages('tenant.workspaces'),
            value: ANALYTICS_ENTITY_TYPE.WORKSPACE,
        },
        { label: messages('dsp.label'), value: ANALYTICS_ENTITY_TYPE.DSP },
        {
            label: messages('common.channel'),
            value: ANALYTICS_ENTITY_TYPE.CHANNEL,
        },
        ...(isAdmin
            ? [
                  {
                      label: messages('analytics2.distributors'),
                      value: ANALYTICS_ENTITY_TYPE.SOURCE_TYPE,
                  },
              ]
            : []),
        {
            label: messages('common.releasesVideo'),
            value: ANALYTICS_ENTITY_TYPE.RELEASE_VIDEO,
        },
    ].filter((option) => option.value !== selectedItem?.type);

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

            {showRankBy && (
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                        <Typography.Text
                            type="secondary"
                            className="text-xs font-medium"
                        >
                            {messages('analytics2.rankBy')}
                        </Typography.Text>
                    </div>
                    <Radio.Group
                        value={rankBy ?? ''}
                        onChange={(e) => onRankByChange?.(e.target.value)}
                        className="flex w-full flex-col gap-0.5"
                    >
                        <label className="flex cursor-pointer items-center rounded-md px-1 py-1.5 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-700">
                            <Radio value="">{messages('common.none')}</Radio>
                        </label>
                        {rankByOptions.map((option) => (
                            <label
                                key={option.value}
                                className="flex cursor-pointer items-center rounded-md px-1 py-1.5 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-700"
                            >
                                <Radio value={option.value}>
                                    {option.label}
                                </Radio>
                            </label>
                        ))}
                    </Radio.Group>
                </div>
            )}

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
            {/* <div className="space-y-1.5">
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
            </div> */}
        </div>
    );
}
