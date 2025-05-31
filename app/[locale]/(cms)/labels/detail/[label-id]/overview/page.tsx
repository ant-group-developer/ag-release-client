'use client';

import AppContainer from '@/components/ant-music/app-container';
import ListRelease from '@/modules/dashboard/components/list-release';
import { fakeReleasesData } from '@/modules/dashboard/constants/mockData';
import RevenueAnalysisCard from '@/modules/labels/components/label-detail/overview/card/revenue-analysis';
import StreamsAnalysisCard from '@/modules/labels/components/label-detail/overview/card/streams-analysis';
import TopOfReleaseCard from '@/modules/labels/components/label-detail/overview/card/top-of-release';
import TopOfTrackCard from '@/modules/labels/components/label-detail/overview/card/top-of-track';

import LabelDetailHeader from '@/modules/labels/components/label-detail/overview/header';

type Props = {};

export default function Overview({}: Props) {
    return (
        <AppContainer>
            <LabelDetailHeader />
            <div className="grid grid-cols-2 gap-4">
                <TopOfReleaseCard />
                <TopOfTrackCard />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
                <StreamsAnalysisCard />
                <RevenueAnalysisCard />
            </div>
            <div>
                <ListRelease data={fakeReleasesData.slice(0, 7)} />
            </div>
        </AppContainer>
    );
}
