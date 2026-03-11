import { SIZE_ICON } from '@/constants/common';
import { formattedNumber } from '@/helpers/common';
import { theme } from 'antd';
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
    const { token } = theme.useToken();

    const overviewCount = [
        {
            label: messages('release.label'),
            count: overviewData?.releasesCount,
            icon: <DiscAlbum size={SIZE_ICON} />,
            color: 'bg-yellow-50 text-yellow-500',
        },
        {
            label: messages('track.label'),
            count: overviewData?.tracksCount,
            icon: <Disc2 size={SIZE_ICON} />,
            color: 'bg-red-50 text-red-500',
        },
        {
            label: messages('label.label'),
            count: overviewData?.labelsCount,
            icon: <Building2 size={SIZE_ICON} />,
            color: 'bg-green-50 text-green-500',
        },
        {
            label: messages('artist.label'),
            count: overviewData?.artistsCount,
            icon: <Users size={SIZE_ICON} />,
            color: 'bg-blue-50 text-blue-500',
        },
    ];

    return (
        <div>
            <div className="grid grid-cols-4 gap-4">
                {overviewCount?.map((item) => {
                    return (
                        <div
                            key={item.label}
                            className="rounded-lg border p-4 dark:border-zinc-700"
                            style={{ backgroundColor: token.colorBgContainer }}
                        >
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
