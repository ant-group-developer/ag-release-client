'use client';

import FullScreenModal, {
    FullScreenModalProps,
} from '@/components/ui/modal/fullScreenModal';
import { formattedNumber } from '@/helpers/common';
import { cn } from '@/helpers/tailwind';
import { DownloadOutlined } from '@ant-design/icons';
import { App, Button, Grid, Typography } from 'antd';
import dayjs from 'dayjs';
import { DollarSign, Eye, Menu, Music } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import {
    ANALYTICS_ENTITY_TYPE,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_RELEASE_TYPE,
} from '../../enums';
import {
    getCombinedAnalyticsScopeParams,
    getFilterScopeParams,
} from '../../helpers';
import {
    ADVANCED_MODE_PARAM_PREFIX,
    useAdvancedModeModal,
} from '../../hooks/use-advanced-mode-modal';
import { useGetAnalyticsSummary } from '../../hooks/use-get-analytics-summary';
import {
    ActiveAnalyticsEntity,
    AnalyticsCommonParams,
    AnalyticsEntityType,
} from '../../types';
import MetricHeaderTabs, { MetricHeaderTabItem } from '../metric-header-tabs';
import { ContentItem } from './advanced-mode/content-entity-selector';
import ControlsSidebar from './advanced-mode/controls-sidebar';
import DetailContentRenderer from './advanced-mode/detail-content-renderer';
import FilterChipsBar from './advanced-mode/filter-chips-bar';
import OverviewChartRenderer from './advanced-mode/overview-chart-renderer';
import ExportReportProgressPopover from '../export-report-progress-popover';
import { DetailResponse } from '@/types/api';
import { useExportAnalyticsReport } from '../../hooks/use-export-analytics-report';
import { useExportJobStore } from '../../store/use-export-job-store';
import { ExportReportRequest, ExportReportResponse } from '../../types';

export interface AdvancedModeModalProps extends FullScreenModalProps {
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export default function AdvancedModeModal({
    releaseType,
    ...props
}: AdvancedModeModalProps) {
    const messages = useTranslations();
    const screens = Grid.useBreakpoint();

    const {
        entity,
        filters,
        fromDate,
        toDate,
        metric: activeMetric,
        rankBy,
        setEntity,
        setDateRange,
        setMetric,
        setRankBy,
        toggleFilter,
        removeFilter,
        clearAllFilters,
    } = useAdvancedModeModal();

    const [showSidebar, setShowSidebar] = useState(true);

    useEffect(() => {
        if (props.open) {
            if (screens.md === false) {
                setShowSidebar(false);
            } else if (screens.md === true) {
                setShowSidebar(true);
            }
        }
    }, [props.open, screens.md]);

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
            ...getCombinedAnalyticsScopeParams(activeEntity, filters),
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
    }, [
        activeEntity,
        filters,
        effectiveFromDate,
        effectiveToDate,
        releaseType,
    ]);

    // Single unified Analytics Summary hook replacing separate summary calls
    const { analyticsSummaryData } = useGetAnalyticsSummary(
        analyticsSummaryParams
    );

    const { message } = App.useApp();
    const {
        jobs: exportJobs,
        isProgressOpen: isExportProgressOpen,
        addJob,
        removeJob: handleRemoveExportJob,
        clearJobs,
    } = useExportJobStore();
    const { exportAnalyticsReport, isPending: isExporting } =
        useExportAnalyticsReport();

    const handleExport = () => {
        const rawStartDate =
            effectiveFromDate ?? dayjs().startOf('month').format('YYYY-MM-DD');
        const rawEndDate =
            effectiveToDate ?? dayjs().endOf('month').format('YYYY-MM-DD');

        const fromDateFormatted = dayjs(rawStartDate).isValid()
            ? dayjs(rawStartDate).format('YYYY-MM')
            : dayjs().format('YYYY-MM');
        const toDateFormatted = dayjs(rawEndDate).isValid()
            ? dayjs(rawEndDate).format('YYYY-MM')
            : dayjs().format('YYYY-MM');

        const scopeParams = getCombinedAnalyticsScopeParams(
            activeEntity,
            filters
        );
        const filterScope = getFilterScopeParams(filters);

        const tenantIds = scopeParams.tenantId
            ? [scopeParams.tenantId]
            : undefined;

        const payload: ExportReportRequest = {
            fromDate: fromDateFormatted,
            endDate: toDateFormatted,
            format: 'xlsx',
            ...(tenantIds ? { tenantIds } : {}),
            ...(scopeParams.labelId ? { labelId: scopeParams.labelId } : {}),
            ...(scopeParams.artistId ? { artistId: scopeParams.artistId } : {}),
            ...(scopeParams.releaseId
                ? { releaseId: scopeParams.releaseId }
                : {}),
            ...(scopeParams.dspId
                ? {
                      dspId: scopeParams.dspId,
                      pgDspId: scopeParams.pgDspId || scopeParams.dspId,
                      dspReportId:
                          scopeParams.dspReportId || scopeParams.dspId,
                  }
                : {}),
            ...(scopeParams.isrc ? { isrc: scopeParams.isrc } : {}),
            ...(scopeParams.channelId
                ? { channelId: scopeParams.channelId }
                : {}),
            ...(filterScope.importSource
                ? { importSource: filterScope.importSource }
                : {}),
        };

        message.loading({
            content: 'Đang xuất báo cáo, vui lòng đợi trong giây lát...',
            key: 'export-report-status',
            duration: 2.5,
        });

        exportAnalyticsReport({
            payload,
            onSuccess: (data: DetailResponse<ExportReportResponse>) => {
                if (data?.data?.jobId) {
                    addJob(data.data.jobId);
                }
                message.success({
                    content: 'Đang xuất báo cáo, vui lòng đợi trong giây lát...',
                    key: 'export-report-status',
                    duration: 3,
                });
            },
            onError: () => {
                message.error({
                    content:
                        messages('common.exportReportFailed') ||
                        'Xuất báo cáo thất bại',
                    key: 'export-report-status',
                    duration: 3,
                });
            },
        });
    };

    const handleSelectEntity = (item?: ContentItem) => {
        if (!item || (!item.id && !item.entitySubId)) {
            setEntity({ type: entity.type });
        } else {
            setEntity({
                type: (item.type ||
                    entity.type) as ActiveAnalyticsEntity['type'],
                id: item.id,
                entitySubId: item.entitySubId,
                title: item.title,
                thumbnail: item.thumbnailUrl,
            });
        }

        if (screens.md === false) {
            setShowSidebar(false);
        }
    };

    const handleTableSelectEntity = (item?: ContentItem) => {
        if (!item || (!item.id && !item.entitySubId)) {
            return;
        }

        // All clicks within table cells act as secondary filters
        toggleFilter({
            type: (item.type || entity.type) as AnalyticsEntityType,
            id: (item.id || item.entitySubId) as string,
            entitySubId: item.entitySubId,
            title: item.title,
            thumbnailUrl: item.thumbnailUrl,
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
                <div className="flex w-full items-center justify-between gap-3">
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
                    <Button
                        size="small"
                        type="primary"
                        icon={<DownloadOutlined />}
                        loading={isExporting}
                        disabled={isExporting}
                        onClick={handleExport}
                        className="!w-auto"
                    >
                        {messages('common.exportReport')}
                    </Button>
                </div>
            }
            width="100%"
        >
            <div className="relative flex h-[calc(100vh-57px)] w-full overflow-hidden">
                {/* Backdrop overlay for mobile screen */}
                {showSidebar && screens.md === false && (
                    <div
                        className="backdrop-blur-xs absolute inset-0 z-20 bg-black/40 md:hidden"
                        onClick={() => setShowSidebar(false)}
                    />
                )}

                {/* Menu / Controls Sidebar Wrapper */}
                <div
                    className={cn(
                        'shrink-0 overflow-hidden transition-all duration-300 ease-in-out',
                        'absolute inset-y-0 left-0 z-30 border-r border-slate-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 md:relative md:z-auto md:border-r-0 md:bg-transparent md:shadow-none',
                        showSidebar
                            ? 'w-[320px] max-w-[85vw] opacity-100 md:w-[350px]'
                            : 'pointer-events-none w-0 opacity-0 md:pointer-events-auto'
                    )}
                >
                    <div className="h-full w-[320px] max-w-[85vw] overflow-y-auto md:w-[350px]">
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
                        {/* Filter Chips Bar */}
                        <FilterChipsBar
                            filters={filters}
                            onRemoveFilter={removeFilter}
                            onClearAll={clearAllFilters}
                        />

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
                                filters={filters}
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
                            filters={filters}
                            rankBy={rankBy}
                            fromDate={effectiveFromDate}
                            toDate={effectiveToDate}
                            releaseType={releaseType}
                            activeMetric={activeMetric}
                            paramPrefix={ADVANCED_MODE_PARAM_PREFIX}
                            onMetricChange={(metric) =>
                                setMetric(metric as ANALYTICS_METRIC_KEY)
                            }
                            onSelectEntity={handleTableSelectEntity}
                            enabled={props.open !== false}
                        />
                    </div>
                </div>
            </div>

            {isExportProgressOpen && exportJobs.length ? (
                <ExportReportProgressPopover
                    jobs={exportJobs}
                    onClose={() => {
                        clearJobs();
                    }}
                    onRemoveJob={handleRemoveExportJob}
                />
            ) : null}
        </FullScreenModal>
    );
}
