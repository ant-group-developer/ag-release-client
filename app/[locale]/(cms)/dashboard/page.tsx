'use client';

import { useFilter } from '@/hooks/use-filter';
import { useRouter } from '@/i18n/routing';
import DspChart from '@/modules/dashboard/components/area-chart/dsp-chart';
import StreamChart from '@/modules/dashboard/components/area-chart/stream-chart';
import DashboardHeader from '@/modules/dashboard/components/header';
import ListNews from '@/modules/dashboard/components/list-news';
import ListRelease from '@/modules/dashboard/components/list-release';
import StatsOverview from '@/modules/dashboard/components/list-statistic';
import ListTop from '@/modules/dashboard/components/list-top';
import MapChart from '@/modules/dashboard/components/map-chart';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { ReleasesDataFilter } from '@/modules/releases/types';
import { theme } from 'antd';

type Props = {};

function Dashboard({}: Props) {
    const router = useRouter();
    const { token } = theme.useToken();

    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<ReleasesDataFilter>({
        page: 1,
        pageSize: 21,
    });

    const { releasesData } = useGetListReleases(dataFilter);

    return (
        <div>
            <DashboardHeader />

            <div className="flex flex-col gap-4 overflow-auto px-4 py-4">
                <StatsOverview />

                <DspChart />

                <ListTop />

                <div className="grid max-h-[550px] gap-4 overflow-hidden sm:grid-cols-1 lg:grid-cols-4">
                    <div className="col-span-1">
                        <MapChart />
                    </div>
                    <div className="col-span-3">
                        <StreamChart />
                    </div>
                </div>

                <ListRelease data={releasesData.items.slice(0, 14)} />

                <ListNews />
            </div>
        </div>
    );
}

export default Dashboard;
