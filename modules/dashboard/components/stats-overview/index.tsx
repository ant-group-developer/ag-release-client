import { SIZE_ICON } from '@/constants/common';
import { formattedNumber } from '@/helpers/common';
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
            color: 'bg-yellow-50 text-yellow-500', // vàng nhạt
        },
        {
            label: messages('track.label'),
            count: overviewData?.tracksCount,
            icon: <Disc2 size={SIZE_ICON} />,
            color: 'bg-red-50 text-red-500', // đỏ nhạt
        },
        {
            label: messages('label.label'),
            count: overviewData?.labelsCount,
            icon: <Building2 size={SIZE_ICON} />,
            color: 'bg-green-50 text-green-500', // xanh lá nhạt
        },
        {
            label: messages('artist.label'),
            count: overviewData?.artistsCount,
            icon: <Users size={SIZE_ICON} />,
            color: 'bg-blue-50 text-blue-500', // xanh dương nhạt
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
                            {/* <Statistic
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
                                        </div>
                                    );
                                }}
                            /> */}
                            <div className="flex items-center gap-3">
                                <div
                                    className={`rounded-full p-3 ${item.color}`}
                                >
                                    {item.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-semibold">
                                        {formattedNumber(item?.count)}
                                    </span>
                                    <span className="text-gray-500">
                                        {item?.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
