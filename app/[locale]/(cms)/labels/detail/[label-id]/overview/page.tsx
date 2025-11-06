'use client';

import { SIZE_ICON } from '@/constants/common';
import ListRelease from '@/modules/dashboard/components/list-release';

import RevenueAnalysisCard from '@/modules/labels/components/label-detail/overview/card/revenue-analysis';
import StatItem from '@/modules/labels/components/label-detail/overview/card/stat-item';
import StreamsAnalysisCard from '@/modules/labels/components/label-detail/overview/card/streams-analysis';
import { useGetDetailLabel } from '@/modules/labels/hooks/use-get-detail-label';

import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { theme } from 'antd';
import { Disc2, DiscAlbum } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type Props = {};

export default function Overview({}: Props) {
    // Router - params
    const params = useParams();
    const labelId = params['label-id'];

    const messages = useTranslations();
    const { releasesData } = useGetListReleases({});
    const { token } = theme.useToken();
    const statStyles = {
        backgroundColor: token.colorBgContainer,
    };
    const { labelData, isLoading, error } = useGetDetailLabel(
        labelId as string
    );
    return (
        <div>
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
            <div className="mt-4 grid grid-cols-2 gap-4">
                <StreamsAnalysisCard />
                <RevenueAnalysisCard />
            </div>
            <div>
                <ListRelease data={releasesData.items.slice(0, 7)} />
            </div>
        </div>
    );
}
