import { useTranslations } from 'next-intl';
import { IssueCountData, OverviewCountData } from '../../types';
import StatCard from './stat-card';
import NewUpdatesCard from './update-card';

type Props = {
    issuesData: IssueCountData[];
    isIssuesLoading: boolean;
    overviewData: OverviewCountData;
    isOverviewLoading: boolean;
};

export default function StatsOverview({
    issuesData,
    isIssuesLoading,
    overviewData,
    isOverviewLoading,
}: Props) {
    const messages = useTranslations();

    const issuesCount = issuesData?.map((item) => ({
        label: item?.nameEn,
        count: Number(item?.total),
    }));

    const overviewCount = [
        {
            label: messages('release.label'),
            count: overviewData?.releasesCount,
        },
        {
            label: messages('track.label'),
            count: overviewData?.tracksCount,
        },
        {
            label: messages('label.label'),
            count: overviewData?.labelsCount,
        },
        {
            label: messages('artist.label'),
            count: overviewData?.artistsCount,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
            <StatCard
                title={messages('common.issues')}
                data={issuesCount}
                loading={isIssuesLoading}
            />

            <StatCard
                title={messages('common.overview')}
                data={overviewCount}
                loading={isOverviewLoading}
            />

            <NewUpdatesCard />

            {/* <StatCard
                title="Issues"
                value="15"
                trend={32.4}
                data={issuesCard.data}
            /> */}

            {/* <StatCard
                title="White label/Label"
                value="8"
                trend={18.45}
                data={whiteLabelCard.data}
            /> */}
        </div>
    );
}
