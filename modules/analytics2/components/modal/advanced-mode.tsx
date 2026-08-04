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
    AnalyticsCommonParams,
    AnalyticsEntityType,
} from '../../types';
import MetricHeaderTabs, { MetricHeaderTabItem } from '../metric-header-tabs';
import { ContentItem } from './advanced-mode/content-entity-selector';
import ControlsSidebar from './advanced-mode/controls-sidebar';
import DetailContentRenderer from './advanced-mode/detail-content-renderer';
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
    const initialEntity = data?.initialEntity;
    const effectiveFromDate = fromDate ?? data?.fromDate;
    const effectiveToDate = toDate ?? data?.toDate;

    const [
        {
            entityType: urlEntityType,
            entityId: urlEntityId,
            entitySubId: urlEntitySubId,
        },
        setQueryParams,
    ] = useQueryStates({
        entityType: parseAsString,
        entityId: parseAsString,
        entitySubId: parseAsString,
        page: parseAsString,
        pageSize: parseAsString,
        keyword: parseAsString,
        startDate: parseAsString,
        endDate: parseAsString,
        type: parseAsString,
        releaseType: parseAsString,
    });

    const [selectedItem, setSelectedItem] = useState<ContentItem | undefined>();
    const [showSidebar, setShowSidebar] = useState(true);
    const [localFromDate, setLocalFromDate] = useState(
        effectiveFromDate || dayjs().subtract(27, 'day').format('YYYY-MM-DD')
    );
    const [localToDate, setLocalToDate] = useState(
        effectiveToDate || dayjs().format('YYYY-MM-DD')
    );
    const [activeMetric, setActiveMetric] = useState<ANALYTICS_METRIC_KEY>(
        ANALYTICS_METRIC_KEY.TOTAL_VIEWS
    );

    const handleClearQueryParams = () => {
        setSelectedItem(undefined);
        setQueryParams({
            entityType: null,
            entityId: null,
            entitySubId: null,
            page: null,
            pageSize: null,
            keyword: null,
            startDate: null,
            endDate: null,
            type: null,
            releaseType: null,
        });
    };

    useEffect(() => {
        if (effectiveFromDate) setLocalFromDate(effectiveFromDate);
        if (effectiveToDate) setLocalToDate(effectiveToDate);

        return () => {
            handleClearQueryParams();
        };
    }, [effectiveFromDate, effectiveToDate]);

    // Active Entity resolution
    const activeEntity = useMemo<ActiveAnalyticsEntity>(() => {
        let type: AnalyticsEntityType =
            initialEntity.type ?? ANALYTICS_ENTITY_TYPE.RELEASE;

        if (urlEntityType) {
            type = urlEntityType as AnalyticsEntityType;
        }

        return {
            type,
            id: urlEntityId ?? selectedItem?.id ?? initialEntity.id,
            entitySubId:
                urlEntitySubId ??
                selectedItem?.entitySubId ??
                initialEntity.entitySubId,
        };
    }, [
        urlEntityType,
        urlEntityId,
        urlEntitySubId,
        initialEntity.type,
        initialEntity.id,
        initialEntity.entitySubId,
        selectedItem?.id,
        selectedItem?.entitySubId,
    ]);

    const analyticsSummaryParams = useMemo<AnalyticsCommonParams>(() => {
        const params: AnalyticsCommonParams = {
            fromDate: localFromDate,
            toDate: localToDate,
            releaseType,
        };

        if (!activeEntity.id) {
            return params;
        }

        switch (activeEntity.type) {
            case ANALYTICS_ENTITY_TYPE.TRACK:
                return {
                    ...params,
                    trackId: activeEntity.id,
                    isrc: activeEntity.id,
                };
            case ANALYTICS_ENTITY_TYPE.RELEASE:
                return { ...params, releaseId: activeEntity.id };
            case ANALYTICS_ENTITY_TYPE.WORKSPACE:
                return { ...params, tenantId: activeEntity.id };
            case ANALYTICS_ENTITY_TYPE.LABEL:
                return { ...params, labelId: activeEntity.id };
            case ANALYTICS_ENTITY_TYPE.DSP:
                return {
                    ...params,
                    pgDspId: activeEntity.id,
                    dspReportId: activeEntity.entitySubId || activeEntity.id,
                };
            case ANALYTICS_ENTITY_TYPE.ARTIST:
                return { ...params, artistId: activeEntity.id };
            case ANALYTICS_ENTITY_TYPE.CHANNEL:
                return { ...params, channelId: activeEntity.id };
            case ANALYTICS_ENTITY_TYPE.SOURCE_TYPE:
                return { ...params, sourceType: activeEntity.id };
            default:
                return params;
        }
    }, [
        activeEntity.entitySubId,
        activeEntity.id,
        activeEntity.type,
        localFromDate,
        localToDate,
        releaseType,
    ]);

    // Single unified Analytics Summary hook replacing separate summary calls
    const { analyticsSummaryData } = useGetAnalyticsSummary(
        analyticsSummaryParams
    );

    const handleSelectEntity = (item?: ContentItem) => {
        if (!item || (!item.id && !item.entitySubId)) {
            setSelectedItem(undefined);
            setQueryParams({
                entityType: null,
                entityId: null,
                entitySubId: null,
                page: null,
                pageSize: null,
                keyword: null,
                startDate: null,
                endDate: null,
            });
            return;
        }

        setSelectedItem(item);

        setQueryParams({
            entityType: item.type || null,
            entityId: item.id || null,
            entitySubId: item.entitySubId || null,
            page: null,
            pageSize: null,
            keyword: null,
            startDate: null,
            endDate: null,
            type: null,
            releaseType: null,
        });
    };

    const currentSelectedItem = useMemo<ContentItem | undefined>(() => {
        if (!selectedItem && !urlEntityId && !initialEntity.id) {
            return undefined;
        }
        return {
            id: selectedItem?.id || activeEntity.id || '',
            entitySubId: selectedItem?.entitySubId || activeEntity.entitySubId,
            title: selectedItem?.title || activeEntity.type,
            type: activeEntity.type,
            thumbnailUrl: selectedItem?.thumbnailUrl,
        };
    }, [
        activeEntity.type,
        activeEntity.id,
        activeEntity.entitySubId,
        selectedItem,
        urlEntityId,
        initialEntity.id,
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
            onCancel={(e) => {
                handleClearQueryParams();
                props.onCancel?.(e);
            }}
            afterClose={() => {
                handleClearQueryParams();
                props.afterClose?.();
            }}
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
                            onMetricChange={(metric) =>
                                setActiveMetric(metric as ANALYTICS_METRIC_KEY)
                            }
                            selectedItem={currentSelectedItem}
                            initialType={initialEntity.type}
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
                                onChangeKey={(metric) =>
                                    setActiveMetric(
                                        metric as ANALYTICS_METRIC_KEY
                                    )
                                }
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
                            activeMetric={activeMetric}
                            onMetricChange={(metric) =>
                                setActiveMetric(metric as ANALYTICS_METRIC_KEY)
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
