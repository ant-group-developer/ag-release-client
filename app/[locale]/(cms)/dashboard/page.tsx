'use client';

import { PAGE_SIZE } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
// import StreamChart from '@/modules/dashboard/components/bar-chart/stream-chart';
import ListRelease from '@/modules/dashboard/components/list-release';
// import MapChart from '@/modules/dashboard/components/map-chart';
import DateSelect2 from '@/components/ui/select/date-select2';
import { DATE_FORMAT } from '@/enums/common';
import { formattedNumber } from '@/helpers/common';
import RootAnalyticsOverviewChart from '@/modules/analytics2/components/chart/root-analytics-overview-chart';
import MetricHeaderTabs, {
    MetricHeaderTabItem,
} from '@/modules/analytics2/components/metric-header-tabs';
import AnalyticsRankings from '@/modules/analytics2/components/ranking/analytics-rankings';
import { ANALYTICS_METRIC_KEY } from '@/modules/analytics2/enums';
import { useGetAnalyticsSummary } from '@/modules/analytics2/hooks/use-get-analytics-summary';
import StatsOverview from '@/modules/dashboard/components/stats-overview';
import { DashboardDataFilter } from '@/modules/dashboard/types';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import dayjs from 'dayjs';
import { DollarSign, Eye, Music } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Props = {};

function Dashboard({}: Props) {
    // const router = useRouter();
    const { token } = theme.useToken();
    const [startDate] = useState(() =>
        dayjs().subtract(6, 'month').toISOString()
    );
    const [endDate] = useState(() => dayjs().toISOString());

    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<DashboardDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
        startDate,
        endDate,
        isImportedFromReport: 'false',
    });
    const messages = useTranslations();
    const { releasesData, isLoading } = useGetListReleases(dataFilter);

    const fromDate = dataFilter.startDate
        ? dayjs(dataFilter.startDate).format(DATE_FORMAT.MYSQL_TYPE_DATE)
        : '';
    const toDate = dataFilter.endDate
        ? dayjs(dataFilter.endDate).format(DATE_FORMAT.MYSQL_TYPE_DATE)
        : '';

    const [activeMetric, setActiveMetric] = useState<string>(
        ANALYTICS_METRIC_KEY.TOTAL_VIEWS
    );

    const handleMetricChange = (key: string) => {
        setActiveMetric(key);
    };

    const effectiveReleaseType = undefined;

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
        <div
            style={{
                backgroundColor: token.colorBgLayout,
            }}
        >
            <PageContainer
                title={messages('dashboard.label')}
                extra={
                    <DateSelect2
                        width={240}
                        externalOnChange={(fromDate, toDate) =>
                            onChangeFilter({
                                startDate: fromDate,
                                endDate: toDate,
                            })
                        }
                        value={`${dataFilter.startDate},${dataFilter.endDate}`}
                        picker="month"
                    />
                }
            >
                {/* <DashboardHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                /> */}

                <div className="flex flex-col gap-4">
                    <StatsOverview
                        params={{
                            fromDate,
                            toDate,
                        }}
                    />

                    <ListRelease
                        data={releasesData.items.slice(0, 10)}
                        loading={isLoading}
                    />

                    <div className="flex flex-col overflow-hidden rounded-lg shadow-sm">
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

                    <AnalyticsRankings fromDate={fromDate} toDate={toDate} />
                </div>

                {/* <ListNews /> */}
            </PageContainer>
        </div>
    );
}

export default Dashboard;
