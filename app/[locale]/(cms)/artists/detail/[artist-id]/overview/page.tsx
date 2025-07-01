'use client';

import AppContainer from '@/components/ant-music/app-container';
import ArtistProfileCard from '@/modules/artist/components/artist-detail/overview/card/artist-profile';
import RevenueAnalysisCard from '@/modules/artist/components/artist-detail/overview/card/revenue-analysis';
import StreamsAnalysisCard from '@/modules/artist/components/artist-detail/overview/card/streams-analysis';
import TopOfReleaseCard from '@/modules/artist/components/artist-detail/overview/card/top-of-release';
import TopOfTrackCard from '@/modules/artist/components/artist-detail/overview/card/top-of-track';
import ArtistDetailHeader from '@/modules/artist/components/artist-detail/overview/header';

type Props = {};

export default function Overview({}: Props) {
    return (
        <AppContainer>
            <ArtistDetailHeader />
            <div className="grid grid-cols-3 gap-4">
                <TopOfReleaseCard />
                <TopOfTrackCard />
                <ArtistProfileCard />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
                <StreamsAnalysisCard />
                <RevenueAnalysisCard />
            </div>
            <div>
                {/* <ListRelease data={fakeReleasesData.slice(0, 7)} /> */}
            </div>
        </AppContainer>
    );
}
