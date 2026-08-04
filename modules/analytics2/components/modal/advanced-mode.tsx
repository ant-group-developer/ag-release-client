'use client';

import FullScreenModal, {
    FullScreenModalProps,
} from '@/components/ui/modal/fullScreenModal';
import { formattedNumber } from '@/helpers/common';
import { cn } from '@/helpers/tailwind';
import useModalStore from '@/hooks/use-modal';
import { Button, Typography } from 'antd';
import dayjs from 'dayjs';
import { DollarSign, Eye, Menu, Music } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { parseAsString, useQueryStates } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';
import {
    ANALYTICS_ENTITY_TYPE,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_RELEASE_TYPE,
} from '../../enums';
import { useGetAnalyticsSummary } from '../../hooks/use-get-analytics-summary';
import {
    ActiveAnalyticsEntity,
    AnalyticModalStoreData,
} from '../../types';
import MetricHeaderTabs, { MetricHeaderTabItem } from '../metric-header-tabs';
import DetailContentRenderer from './advanced-mode/detail-content-renderer';
import { ContentItem } from './advanced-mode/content-entity-selector';
import ControlsSidebar from './advanced-mode/controls-sidebar';
import OverviewChartRenderer from './advanced-mode/overview-chart-renderer';

export interface AdvancedModeModalProps extends FullScreenModalProps {
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function AdvancedModeModal({
    fromDate,
    toDate,
    releaseType,
    ...props
}: AdvancedModeModalProps) {
    const messages = useTranslations();
    const data = useModalStore<AnalyticModalStoreData>(
        (state) => state.dataEdit
    );
    const initialEntity = data?.initialEntity ?? {
        type: ANALYTICS_ENTITY_TYPE.RELEASE,
    };
    const effectiveFromDate = fromDate ?? data?.fromDate;
    const effectiveToDate = toDate ?? data?.toDate;

    const [{ entityType: urlEntityType }, setQueryParams] = useQueryStates({
        entityType: parseAsString,
    });

    const [selectedItem, setSelectedItem] = useState<ContentItem | undefined>();
    const [showSidebar, setShowSidebar] = useState(true);
    const [localFromDate, setLocalFromDate] = useState(
        effectiveFromDate || dayjs().subtract(27, 'day').format('YYYY-MM-DD')
    );
    const [localToDate, setLocalToDate] = useState(
        effectiveToDate || dayjs().format('YYYY-MM-DD')
    );
    const [activeMetric, setActiveMetric] = useState<string>(
        ANALYTICS_METRIC_KEY.TOTAL_VIEWS
    );

    useEffect(() => {
        if (props.open) {
            if (effectiveFromDate) setLocalFromDate(effectiveFromDate);
            if (effectiveToDate) setLocalToDate(effectiveToDate);
        }
    }, [props.open, effectiveFromDate, effectiveToDate]);

    // Active Entity resolution
    const activeEntity = useMemo<ActiveAnalyticsEntity>(() => {
        if (urlEntityType) {
            const normalized = urlEntityType.toLowerCase();
            if (normalized === 'workspace' || normalized === 'workspaces')
                return { type: ANALYTICS_ENTITY_TYPE.WORKSPACE };
            if (normalized === 'release' || normalized === 'releases')
                return { type: ANALYTICS_ENTITY_TYPE.RELEASE };
            if (normalized === 'track' || normalized === 'tracks')
                return { type: ANALYTICS_ENTITY_TYPE.TRACK };
            if (normalized === 'label' || normalized === 'labels')
                return { type: ANALYTICS_ENTITY_TYPE.LABEL };
            if (normalized === 'dsp' || normalized === 'dsps')
                return { type: ANALYTICS_ENTITY_TYPE.DSP };
            if (normalized === 'artist' || normalized === 'artists')
                return { type: ANALYTICS_ENTITY_TYPE.ARTIST };
        }

        return {
            type: initialEntity.type ?? ANALYTICS_ENTITY_TYPE.RELEASE,
        };
    }, [urlEntityType, initialEntity.type]);

    // Single unified Analytics Summary hook replacing separate summary calls
    const { analyticsSummaryData } = useGetAnalyticsSummary(
        {
            fromDate: localFromDate,
            toDate: localToDate,
            releaseType,
        },
        !!props.open
    );

    const handleSelectEntity = (item: {
        id: string;
        type: string;
        title?: string;
    }) => {
        setSelectedItem({
            id: '',
            title: item.title || item.type,
            type: item.type as any,
        });

        setQueryParams({
            entityType: item.type.toLowerCase(),
        });
    };

    const currentSelectedItem = useMemo<ContentItem | undefined>(() => {
        return {
            id: '',
            title: selectedItem?.title || activeEntity.type,
            type: activeEntity.type,
        };
    }, [activeEntity.type, selectedItem]);

    const metricTabItems: MetricHeaderTabItem[] = [
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
            label: messages('analytics.totalTrendViews') || 'Views',
            value: formattedNumber(analyticsSummaryData?.totalTrendViews),
            icon: Eye,
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-100/50 dark:bg-emerald-900/30',
        },
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_USAGE,
            label: messages('analytics.revenue.totalUsage') || 'Usage',
            value: formattedNumber(analyticsSummaryData?.totalUsage),
            icon: Music,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100/50 dark:bg-purple-900/30',
        },
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD,
            label: messages('analytics.totalRevenueUsd') || 'Estimated revenue',
            value: formattedNumber(analyticsSummaryData?.totalRevenueUsd),
            icon: DollarSign,
            color: 'text-cyan-600 dark:text-cyan-400',
            bgColor: 'bg-cyan-100/50 dark:bg-cyan-900/30',
        },
    ];

    return (
        <FullScreenModal
            {...props}
            footer={null}
            styles={{
                body: {
                    overflow: 'hidden',
                    padding: 0,
                },
            }}
            title={
                <div className="flex items-center gap-3">
                    <Button
                        size="small"
                        type="text"
                        icon={
                            <div>
                                <Menu className="opacity-70" />
                            </div>
                        }
                        onClick={() => setShowSidebar((prev) => !prev)}
                        className="flex items-center justify-center !p-1 hover:bg-slate-100 dark:hover:bg-zinc-800"
                    />
                    <Typography.Text strong className="text-base">
                        {messages('common.advancedMode')}
                    </Typography.Text>
                </div>
            }
            width="100%"
        >
            <div className="flex h-[calc(100vh-57px)] w-full overflow-hidden">
                {/* Menu / Controls Sidebar Wrapper */}
                <div
                    className={cn(
                        'shrink-0 overflow-hidden transition-all duration-300 ease-in-out',
                        showSidebar ? 'w-[350px] opacity-100' : 'w-0 opacity-0'
                    )}
                >
                    <div className="h-full w-[350px] overflow-y-auto">
                        <ControlsSidebar
                            fromDate={localFromDate}
                            toDate={localToDate}
                            onDateChange={(start, end) => {
                                setLocalFromDate(start);
                                setLocalToDate(end);
                            }}
                            activeMetric={activeMetric}
                            onMetricChange={setActiveMetric}
                            selectedItem={currentSelectedItem}
                            onContentSelect={handleSelectEntity}
                        />
                    </div>
                </div>

                {/* Main Content Area (Independent Scroll Area) */}
                <div className="h-full min-w-0 flex-1 overflow-y-auto transition-all duration-300 ease-in-out">
                    <div className="flex flex-col space-y-4 p-6">
                        {/* Metric Header Tabs & Overview Chart */}
                        <div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 dark:border-zinc-800">
                            <MetricHeaderTabs
                                items={metricTabItems}
                                activeKey={activeMetric}
                                onChangeKey={setActiveMetric}
                            />
                            <OverviewChartRenderer
                                activeEntity={activeEntity}
                                fromDate={localFromDate}
                                toDate={localToDate}
                                releaseType={releaseType}
                                activeMetric={activeMetric}
                                enabled={props.open !== false}
                            />
                        </div>

                        {/* Details / Table Section */}
                        <DetailContentRenderer
                            activeEntity={activeEntity}
                            fromDate={localFromDate}
                            toDate={localToDate}
                            releaseType={releaseType}
                            enabled={props.open !== false}
                        />
                    </div>
                </div>
            </div>
        </FullScreenModal>
    );
}
