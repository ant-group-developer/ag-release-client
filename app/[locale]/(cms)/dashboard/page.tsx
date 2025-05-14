'use client';

import ListNews from '@/modules/dashboard/components/list-news';
import ListRelease from '@/modules/dashboard/components/list-release';
import CardStatistic from '@/modules/dashboard/components/list-statistic';
import TopList from '@/modules/dashboard/components/top-list-box';
import { fakeListRelease } from '@/modules/dashboard/constants/mockData';
import { TOP_LIST_TYPE } from '@/modules/dashboard/enums';

type Props = {};

function Dashboard({}: Props) {
    return (
        <div className="flex flex-col gap-4 px-4 py-4">
            <CardStatistic />

            <div className="gap flex w-full gap-4">
                <TopList
                    data={fakeListRelease}
                    title="Bài hát hàng đầu"
                    description="Bài hát"
                    className="flex-1"
                    initialTab={TOP_LIST_TYPE.LIST}
                />
                <TopList
                    data={fakeListRelease}
                    title="Bản phát hành hàng đầu"
                    description="Bản phát hành"
                    className="flex-1"
                    initialTab={TOP_LIST_TYPE.LIST}
                />
            </div>

            {/* <div className="gap flex w-full gap-4">
                <DonutChart
                    data={donutChartRegionData}
                    title="Quốc gia hàng đầu"
                    className="flex-1"
                    innerRadius={60}
                    showCenterLabel={false}
                />
                <DonutChart
                    data={donutChartDspData}
                    title="DSP hàng đầu"
                    className="flex-1"
                    innerRadius={60}
                    showCenterLabel={false}
                />
            </div> */}

            <ListRelease />

            <ListNews />
        </div>
    );
}

export default Dashboard;
