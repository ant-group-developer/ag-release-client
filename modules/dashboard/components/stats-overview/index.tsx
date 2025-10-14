import { SIZE_ICON } from '@/constants/common';
import { formattedNumber } from '@/helpers/common';
import { Statistic } from 'antd';
import { Building2, Disc2, DiscAlbum, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { IssueCountData, OverviewCountData } from '../../types';

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

    const overviewCount = [
        {
            label: messages('release.label'),
            count: overviewData?.releasesCount,
            icon: <DiscAlbum size={SIZE_ICON} />,
        },
        {
            label: messages('track.label'),
            count: overviewData?.tracksCount,
            icon: <Disc2 size={SIZE_ICON} />,
        },
        {
            label: messages('label.label'),
            count: overviewData?.labelsCount,
            icon: <Building2 size={SIZE_ICON} />,
        },
        {
            label: messages('artist.label'),
            count: overviewData?.artistsCount,
            icon: <Users size={SIZE_ICON} />,
        },
    ];

    return (
        <div>
            <div className="grid grid-cols-4 gap-4">
                {/* <AppCard
                    icon={<DiscAlbum size={SIZE_ICON} />}
                    title={messages('release.label')}
                    className="bg-white"
                >
                    <div className="flex items-center justify-between gap-2 px-4 py-2">
                        <Typography.Text className="!text-lg font-semibold">
                            {formattedNumber(23412312)}
                        </Typography.Text>
                        <Tag color="green" bordered={false}>
                            <div className="flex gap-1">
                                <span>15%</span>
                                <TrendingUp size={SIZE_ICON} />
                            </div>
                        </Tag>
                    </div>
                </AppCard> */}
                {overviewCount?.map((item) => {
                    return (
                        <div
                            key={item.label}
                            className="rounded-lg border bg-white p-4"
                        >
                            <Statistic
                                title={
                                    <div className="flex items-center gap-2">
                                        {item.icon}
                                        <span>{item?.label}</span>
                                    </div>
                                }
                                valueRender={() => {
                                    return (
                                        <div className="flex items-center justify-between gap-2 py-2">
                                            <span>
                                                {formattedNumber(item?.count)}
                                            </span>
                                            {/* <Tag color="green">
                                                <div className="flex items-center gap-1">
                                                    <span>{15}%</span>
                                                    <TrendingUp
                                                        size={SIZE_ICON}
                                                    />
                                                </div>
                                            </Tag> */}
                                        </div>
                                    );
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
