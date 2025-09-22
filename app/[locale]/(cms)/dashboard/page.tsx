'use client';

import { PAGE_SIZE } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import StreamChart from '@/modules/dashboard/components/area-chart/stream-chart';
import DashboardHeader from '@/modules/dashboard/components/header';
import ListNews from '@/modules/dashboard/components/list-news';
import ListRelease from '@/modules/dashboard/components/list-release';
import ListTop from '@/modules/dashboard/components/list-top';
import MapChart from '@/modules/dashboard/components/map-chart';
import StatsOverview from '@/modules/dashboard/components/stats-overview';
import {
    useGetCountCountries,
    useGetCountIssues,
    useGetCountOverview,
} from '@/modules/dashboard/hooks/use-get-count';
import { DashboardDataFilter } from '@/modules/dashboard/types';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import dayjs from 'dayjs';
import { useState } from 'react';

type Props = {};

function Dashboard({}: Props) {
    // const router = useRouter();
    // const { token } = theme.useToken();
    const [startDate] = useState(() =>
        dayjs().subtract(30, 'day').toISOString()
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
    });

    const { releasesData } = useGetListReleases(dataFilter);
    const { countIssuesData, isFetching: isIssuesLoading } =
        useGetCountIssues(dataFilter);
    const { countOverviewData, isFetching: isOverviewLoading } =
        useGetCountOverview(dataFilter);
    const { countCountriesData } = useGetCountCountries(dataFilter);

    return (
        <div>
            <DashboardHeader
                dataFilter={dataFilter}
                onChangeFilter={onChangeFilter}
            />

            <div className="flex flex-col gap-4 overflow-auto px-4 py-4">
                <StatsOverview
                    issuesData={countIssuesData}
                    overviewData={countOverviewData}
                    isIssuesLoading={isIssuesLoading}
                    isOverviewLoading={isOverviewLoading}
                />

                {/* <DspChart /> */}
                <div className="grid max-h-[550px] gap-4 overflow-hidden sm:grid-cols-1 lg:grid-cols-5">
                    <div className="col-span-2">
                        <MapChart data={countCountriesData} />
                    </div>
                    <div className="col-span-3">
                        <StreamChart />
                    </div>
                </div>

                <ListTop />

                <ListRelease data={releasesData.items.slice(0, 14)} />

                <ListNews />
            </div>
        </div>
    );
}

export default Dashboard;
