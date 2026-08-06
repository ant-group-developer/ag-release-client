'use client';

import FullScreenModal, {
    FullScreenModalProps,
} from '@/components/ui/modal/fullScreenModal';
import { formattedNumber } from '@/helpers/common';
import { cn } from '@/helpers/tailwind';
import { Button, Typography } from 'antd';
import dayjs from 'dayjs';
import { DollarSign, Eye, Menu, Music } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import {
    ANALYTICS_ENTITY_TYPE,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_RELEASE_TYPE,
} from '../../enums';
import {
    ADVANCED_MODE_PARAM_PREFIX,
    useAdvancedModeModal,
} from '../../hooks/use-advanced-mode-modal';
import { getAnalyticsScopeParams } from '../../helpers';
import { useGetAnalyticsSummary } from '../../hooks/use-get-analytics-summary';
import { ActiveAnalyticsEntity, AnalyticsCommonParams } from '../../types';
import MetricHeaderTabs, { MetricHeaderTabItem } from '../metric-header-tabs';
import { ContentItem } from './advanced-mode/content-entity-selector';
import ControlsSidebar from './advanced-mode/controls-sidebar';
import DetailContentRenderer from './advanced-mode/detail-content-renderer';
import OverviewChartRenderer from './advanced-mode/overview-chart-renderer';

export interface AdvancedModeModalProps extends FullScreenModalProps {
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function AdvancedModeModal({
    releaseType,
    ...props
}: AdvancedModeModalProps) {
    const messages = useTranslations();

    const {
        entity,
        fromDate,
        toDate,
        metric: activeMetric,
        rankBy,
        setEntity,
        setDateRange,
        setMetric,
        setRankBy,
    } = useAdvancedModeModal();

    const [showSidebar, setShowSidebar] = useState(true);

    const effectiveFromDate =
        fromDate || dayjs().subtract(27, 'day').format('YYYY-MM-DD');
    const effectiveToDate = toDate || dayjs().format('YYYY-MM-DD');

    const activeEntity = useMemo<ActiveAnalyticsEntity>(
        () => ({
            type: entity.type,
            id: entity.id,
            entitySubId: entity.entitySubId,
        }),
        [entity.type, entity.id, entity.entitySubId]
    );

    const analyticsSummaryParams = useMemo<AnalyticsCommonParams>(() => {
        const params: AnalyticsCommonParams = {
            fromDate: effectiveFromDate,
            toDate: effectiveToDate,
            releaseType,
            ...getAnalyticsScopeParams(activeEntity),
        };

        // Video releases live behind the same `releaseId` as audio ones, so the
        // summary needs the release type to disambiguate.
        if (
            activeEntity.id &&
            activeEntity.type === ANALYTICS_ENTITY_TYPE.RELEASE_VIDEO
        ) {
            return { ...params, releaseType: ANALYTICS_RELEASE_TYPE.VIDEO };
        }

        return params;
    }, [activeEntity, effectiveFromDate, effectiveToDate, releaseType]);

    // Single unified Analytics Summary hook replacing separate summary calls
    const { analyticsSummaryData } = useGetAnalyticsSummary(
        analyticsSummaryParams
    );

    const handleSelectEntity = (item?: ContentItem) => {
        if (!item || (!item.id && !item.entitySubId)) {
            setEntity({ type: entity.type });
            return;
        }

        setEntity({
            type: (item.type || entity.type) as ActiveAnalyticsEntity['type'],
            id: item.id,
            entitySubId: item.entitySubId,
            title: item.title,
            thumbnail: item.thumbnailUrl,
        });
    };

    const currentSelectedItem = useMemo<ContentItem | undefined>(() => {
        if (!entity.id) {
            return undefined;
        }

        return {
            id: entity.id,
            entitySubId: entity.entitySubId,
            title: entity.title || entity.type,
            type: entity.type,
            thumbnailUrl: entity.thumbnail,
        };
    }, [
        entity.type,
        entity.id,
        entity.entitySubId,
        entity.title,
        entity.thumbnail,
    ]);

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
                            fromDate={effectiveFromDate}
                            toDate={effectiveToDate}
                            onDateChange={(start, end) => {
                                setDateRange(start, end);
                            }}
                            activeMetric={activeMetric}
                            onMetricChange={(metric) =>
                                setMetric(metric as ANALYTICS_METRIC_KEY)
                            }
                            selectedItem={currentSelectedItem}
                            initialType={entity.type}
                            onContentSelect={handleSelectEntity}
                            rankBy={rankBy}
                            onRankByChange={setRankBy}
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
                                onChangeKey={(metric) =>
                                    setMetric(metric as ANALYTICS_METRIC_KEY)
                                }
                            />
                            <OverviewChartRenderer
                                activeEntity={activeEntity}
                                fromDate={effectiveFromDate}
                                toDate={effectiveToDate}
                                releaseType={releaseType}
                                activeMetric={activeMetric}
                                enabled={props.open !== false}
                            />
                        </div>

                        {/* Details / Table Section */}
                        <DetailContentRenderer
                            activeEntity={activeEntity}
                            rankBy={rankBy}
                            fromDate={effectiveFromDate}
                            toDate={effectiveToDate}
                            releaseType={releaseType}
                            activeMetric={activeMetric}
                            paramPrefix={ADVANCED_MODE_PARAM_PREFIX}
                            onMetricChange={(metric) =>
                                setMetric(metric as ANALYTICS_METRIC_KEY)
                            }
                            onSelectEntity={handleSelectEntity}
                            enabled={props.open !== false}
                        />
                    </div>
                </div>
            </div>
        </FullScreenModal>
    );
}
