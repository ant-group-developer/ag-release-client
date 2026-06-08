import { useFilter } from '@/hooks/use-filter';
import StatsOverview from '@/modules/dashboard/components/stats-overview';
import {
    useGetCountIssues,
    useGetCountOverview,
} from '@/modules/dashboard/hooks/use-get-count';
import AnalyticsChart from './analytics-chart';
import AnalyticsRankings from './analytics-rankings';

interface Props {
    fromDate: string;
    toDate: string;
}

export default function PlaysTabContent({ fromDate, toDate }: Props) {
    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<any>({
        page: 1,
        startDate: fromDate,
        endDate: toDate,
    });

    const { countIssuesData, isFetching: isIssuesLoading } =
        useGetCountIssues(dataFilter);

    const { countOverviewData, isFetching: isOverviewLoading } =
        useGetCountOverview(dataFilter);

    return (
        <>
            {/* <MetricCards fromDate={fromDate} toDate={toDate} /> */}

            <StatsOverview
                issuesData={countIssuesData}
                overviewData={countOverviewData}
                isIssuesLoading={isIssuesLoading}
                isOverviewLoading={isOverviewLoading}
            />

            <AnalyticsChart fromDate={fromDate} toDate={toDate} />
            {/* <AnalyticsDailyChart /> */}
            <AnalyticsRankings fromDate={fromDate} toDate={toDate} />
            {/* <RecentReleasesTable fromDate={fromDate} toDate={toDate} /> */}
        </>
    );
}
