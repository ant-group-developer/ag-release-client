import { useFilter } from '@/hooks/use-filter';
import StatsOverview from '@/modules/dashboard/components/stats-overview';
import PlaysTimelineChart from '../chart/plays-timeline-chart';
import AnalyticsRankings from '../ranking/analytics-rankings';

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

    return (
        <>
            {/* <MetricCards fromDate={fromDate} toDate={toDate} /> */}

            <StatsOverview params={dataFilter} />

            <PlaysTimelineChart fromDate={fromDate} toDate={toDate} />
            {/* <AnalyticsDailyChart /> */}
            <AnalyticsRankings fromDate={fromDate} toDate={toDate} />
            {/* <RecentReleasesTable fromDate={fromDate} toDate={toDate} /> */}
        </>
    );
}
