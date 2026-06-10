'use client';

import { SIZE_ICON } from '@/constants/common';
import { ORDER } from '@/enums/common';
import PlaysTimelineChart from '@/modules/analytics2/components/chart/plays-timeline-chart';
import RevenueTimelineChart from '@/modules/analytics2/components/chart/revenue-timeline-chart';
import ListRelease from '@/modules/dashboard/components/list-release';

import StatItem from '@/modules/labels/components/label-detail/overview/card/stat-item';
import { useGetDetailLabel } from '@/modules/labels/hooks/use-get-detail-label';
import { RELEASES_STATUS, RELEASES_TABLE_KEY } from '@/modules/releases/enums';

import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { theme } from 'antd';
import dayjs from 'dayjs';
import { Disc2, DiscAlbum } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type Props = {};

export default function Overview({}: Props) {
    // Router - params
    const params = useParams();
    const labelId = params['label-id'];

    const messages = useTranslations();
    const { releasesData } = useGetListReleases({
        labelId: labelId as string,
        status: RELEASES_STATUS.DISTRIBUTED,
        orderBy: ORDER.DESC,
        fieldOrder: RELEASES_TABLE_KEY.RELEASE_DATE,
    });
    const { token } = theme.useToken();
    const statStyles = {
        backgroundColor: token.colorBgContainer,
    };
    const fromDate = dayjs().subtract(29, 'day').format('YYYY-MM-DD');
    const toDate = dayjs().format('YYYY-MM-DD');
    const chartHeight = 250;
    const { labelData, isLoading, error } = useGetDetailLabel(
        labelId as string
    );
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <StatItem
                    iconBgColor="bg-green-50"
                    title={messages('release.count')}
                    value={labelData?.releaseCount}
                    icon={
                        <DiscAlbum
                            size={SIZE_ICON}
                            className="text-green-500"
                        />
                    }
                    style={statStyles}
                />

                <StatItem
                    iconBgColor="bg-blue-50"
                    title={messages('track.count')}
                    value={labelData?.trackCount}
                    icon={<Disc2 size={SIZE_ICON} className="text-blue-500" />}
                    style={statStyles}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <PlaysTimelineChart
                    fromDate={fromDate}
                    toDate={toDate}
                    chartHeight={chartHeight}
                />
                <RevenueTimelineChart
                    fromDate={fromDate}
                    toDate={toDate}
                    chartHeight={chartHeight}
                />
            </div>
            <div>
                <ListRelease data={releasesData.items.slice(0, 7)} />
            </div>
        </div>
    );
}
