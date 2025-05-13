'use client';

import ListCardRelease from '@/modules/dashboard/components/list-card-release';
import CardStatistic from '@/modules/dashboard/components/list-card-statistic';
import ListNews from '@/modules/dashboard/components/list-news';

type Props = {};

function Dashboard({}: Props) {
    return (
        <div className="px-4 py-4">
            <CardStatistic />

            <ListCardRelease />

            <ListNews />
        </div>
    );
}

export default Dashboard;
