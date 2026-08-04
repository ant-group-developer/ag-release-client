'use client';

import { ANALYTIC_SORT_BY } from '@/enums/common';
import { formattedNumber } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import AnalyticsExtraHeader from '@/modules/analytics2/components/analytics-extra-header';
import RootAnalyticsOverviewChart from '@/modules/analytics2/components/chart/root-analytics-overview-chart';
import ExportReportProgressPopover from '@/modules/analytics2/components/export-report-progress-popover';
import MetricHeaderTabs, {
    MetricHeaderTabItem,
} from '@/modules/analytics2/components/metric-header-tabs';
import AdvancedModeModal from '@/modules/analytics2/components/modal/advanced-mode';
import ExportReportModal from '@/modules/analytics2/components/modal/export-report-modal';
import PlaysTabContent from '@/modules/analytics2/components/tab/plays-tab-content';
import RevenueTabContent from '@/modules/analytics2/components/tab/revenue-tab-content';
import {
    ANALYTICS_DEFAULT_END_DATE,
    ANALYTICS_DEFAULT_START_DATE,
} from '@/modules/analytics2/constants/types';
import {
    ANALYTICS_METRIC_KEY,
    ANALYTICS_MODAL_TYPE,
    ANALYTICS_RELEASE_TYPE,
} from '@/modules/analytics2/enums';
import { ANALYTICS2_TABS } from '@/modules/analytics2/enums/tabs';
import { useGetAnalyticsSummary } from '@/modules/analytics2/hooks/use-get-analytics-summary';
import {
    Analytics2DataFilter,
    ExportReportJob,
} from '@/modules/analytics2/types';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { DollarSign, Eye, Music } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const defaultFilter: Analytics2DataFilter = {
    startDate: ANALYTICS_DEFAULT_START_DATE,
    endDate: ANALYTICS_DEFAULT_END_DATE,
    releaseType: ANALYTICS_RELEASE_TYPE.ALL,
    tab: ANALYTICS2_TABS.VIEWS,
};

export default function Analytics2Page() {
    const { token } = theme.useToken();
    const messages = useTranslations();

    const searchParams = useSearchParams();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);

    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isExportProgressOpen, setIsExportProgressOpen] = useState(false);
    const [exportJobs, setExportJobs] = useState<ExportReportJob[]>([]);

    const handleExportStarted = (jobId: string) => {
        setExportJobs((prevJobs) => {
            if (prevJobs.some((job) => job.id === jobId)) return prevJobs;

            return [
                ...prevJobs,
                {
                    id: jobId,
                    createdAt: Date.now(),
                },
            ];
        });
        setIsExportProgressOpen(true);
    };

    const handleRemoveExportJob = (jobId: string) => {
        setExportJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
    };

    useEffect(() => {
        if (!exportJobs.length) {
            setIsExportProgressOpen(false);
        }
    }, [exportJobs.length]);

    const getMetricKeyFromParams = (
        tab?: string | null,
        sort?: string | null
    ) => {
        if (tab === ANALYTICS2_TABS.REVENUE) {
            if (
                sort === ANALYTIC_SORT_BY.USAGE ||
                sort === ANALYTIC_SORT_BY.VIEWS
            )
                return ANALYTICS_METRIC_KEY.TOTAL_USAGE;
            return ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD;
        }
        return ANALYTICS_METRIC_KEY.TOTAL_VIEWS;
    };

    const initialTab =
        (searchParams.get('tab') as ANALYTICS2_TABS) || ANALYTICS2_TABS.VIEWS;
    const initialSortBy = searchParams.get('sortBy') || undefined;

    const [activeTab, setActiveTab] = useState<ANALYTICS2_TABS>(initialTab);
    const [activeMetric, setActiveMetric] = useState<string>(() =>
        getMetricKeyFromParams(initialTab, initialSortBy)
    );
    const [sortBy, setSortBy] = useState<string | undefined>(
        initialTab === ANALYTICS2_TABS.REVENUE
            ? initialSortBy || ANALYTIC_SORT_BY.REVENUE
            : undefined
    );

    const initialReleaseType =
        (searchParams.get('releaseType') as ANALYTICS_RELEASE_TYPE) ||
        ANALYTICS_RELEASE_TYPE.ALL;
    const [releaseType, setReleaseType] =
        useState<ANALYTICS_RELEASE_TYPE>(initialReleaseType);

    useEffect(() => {
        const queryTab = searchParams.get('tab') as ANALYTICS2_TABS;
        const querySortBy = searchParams.get('sortBy');

        const currentTab =
            queryTab === ANALYTICS2_TABS.REVENUE
                ? ANALYTICS2_TABS.REVENUE
                : ANALYTICS2_TABS.VIEWS;

        setActiveTab(currentTab);
        setActiveMetric(getMetricKeyFromParams(queryTab, querySortBy));
        setSortBy(
            currentTab === ANALYTICS2_TABS.REVENUE
                ? querySortBy || ANALYTIC_SORT_BY.REVENUE
                : undefined
        );

        const queryReleaseType =
            (searchParams.get('releaseType') as ANALYTICS_RELEASE_TYPE) ||
            ANALYTICS_RELEASE_TYPE.ALL;
        setReleaseType(queryReleaseType);
    }, [searchParams]);

    const { dataFilter, onChangeFilter } = useFilter<Analytics2DataFilter>({
        ...defaultFilter,
        startDate: searchParams.get('fromDate') || defaultFilter.startDate,
        endDate: searchParams.get('toDate') || defaultFilter.endDate,
    });

    const handleMetricChange = (key: string) => {
        setActiveMetric(key);

        if (key === ANALYTICS_METRIC_KEY.TOTAL_VIEWS) {
            setActiveTab(ANALYTICS2_TABS.VIEWS);
            setSortBy(undefined);
            onChangeFilter({
                tab: ANALYTICS2_TABS.VIEWS,
                sortBy: undefined,
            });
        } else if (key === ANALYTICS_METRIC_KEY.TOTAL_USAGE) {
            setActiveTab(ANALYTICS2_TABS.REVENUE);
            setSortBy(ANALYTIC_SORT_BY.USAGE);
            onChangeFilter({
                tab: ANALYTICS2_TABS.REVENUE,
                sortBy: ANALYTIC_SORT_BY.USAGE,
            });
        } else if (key === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD) {
            setActiveTab(ANALYTICS2_TABS.REVENUE);
            setSortBy(ANALYTIC_SORT_BY.REVENUE);
            onChangeFilter({
                tab: ANALYTICS2_TABS.REVENUE,
                sortBy: ANALYTIC_SORT_BY.REVENUE,
            });
        }
    };

    const handleReleaseTypeChange = (type: ANALYTICS_RELEASE_TYPE) => {
        setReleaseType(type);
        onChangeFilter({
            releaseType: type === ANALYTICS_RELEASE_TYPE.ALL ? undefined : type,
        });
    };

    const fromDate = dataFilter.startDate ?? defaultFilter.startDate!;
    const toDate = dataFilter.endDate ?? defaultFilter.endDate!;

    const effectiveReleaseType =
        releaseType === ANALYTICS_RELEASE_TYPE.ALL ? undefined : releaseType;

    const { analyticsSummaryData } = useGetAnalyticsSummary({
        fromDate,
        toDate,
        releaseType: effectiveReleaseType,
    });

    const metricTabItems: MetricHeaderTabItem[] = [
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
            label: messages('analytics.totalTrendViews'),
            value: formattedNumber(analyticsSummaryData?.totalTrendViews),
            icon: Eye,
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-100/50 dark:bg-emerald-900/30',
        },
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_USAGE,
            label: messages('analytics.revenue.totalUsage'),
            value: formattedNumber(analyticsSummaryData?.totalUsage),
            icon: Music,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100/50 dark:bg-purple-900/30',
        },
        {
            key: ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD,
            label: messages('analytics.totalRevenueUsd'),
            value: formattedNumber(analyticsSummaryData?.totalRevenueUsd),
            icon: DollarSign,
            color: 'text-cyan-600 dark:text-cyan-400',
            bgColor: 'bg-cyan-100/50 dark:bg-cyan-900/30',
        },
    ];

    return (
        <PageContainer
            title={messages('analytics.label')}
            style={{
                backgroundColor: token.colorBgLayout,
                minHeight: '100vh',
            }}
            extra={
                <AnalyticsExtraHeader
                    releaseType={releaseType}
                    fromDate={fromDate}
                    toDate={toDate}
                    onExportClick={() => {
                        if (exportJobs.length) {
                            setIsExportProgressOpen(true);
                        }

                        setIsExportModalOpen(true);
                    }}
                    onReleaseTypeChange={handleReleaseTypeChange}
                    onDateChange={(startDate, endDate) => {
                        onChangeFilter({ startDate, endDate });
                    }}
                />
            }
        >
            <div className="mb-6 flex flex-col overflow-hidden rounded-lg border">
                <MetricHeaderTabs
                    items={metricTabItems}
                    activeKey={activeMetric}
                    onChangeKey={handleMetricChange}
                />
                <RootAnalyticsOverviewChart
                    fromDate={fromDate}
                    toDate={toDate}
                    releaseType={effectiveReleaseType as any}
                    activeMetric={activeMetric}
                />
            </div>
            <div className="flex flex-col gap-6">
                {activeTab === ANALYTICS2_TABS.VIEWS ? (
                    <PlaysTabContent
                        fromDate={fromDate}
                        toDate={toDate}
                        releaseType={effectiveReleaseType as any}
                    />
                ) : (
                    <RevenueTabContent
                        fromDate={fromDate}
                        toDate={toDate}
                        releaseType={effectiveReleaseType as any}
                        sortBy={sortBy}
                    />
                )}
            </div>

            <ExportReportModal
                open={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onExportStarted={handleExportStarted}
                dataFilter={dataFilter}
            />

            {isExportProgressOpen && exportJobs.length ? (
                <ExportReportProgressPopover
                    jobs={exportJobs}
                    onClose={() => {
                        setIsExportProgressOpen(false);
                        setExportJobs([]);
                    }}
                    onRemoveJob={handleRemoveExportJob}
                />
            ) : null}

            {typeModal == ANALYTICS_MODAL_TYPE.ADVANCED_MODE && (
                <AdvancedModeModal
                    open
                    onCancel={() => {
                        closeModal();
                    }}
                />
            )}
        </PageContainer>
    );
}
