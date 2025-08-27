'use client';

import ArtistProfileCard from '@/modules/artist/components/artist-detail/overview/card/artist-profile';
import CountAnalysisCard from '@/modules/artist/components/artist-detail/overview/card/count-analysis-card';
import RevenueAnalysisCard from '@/modules/artist/components/artist-detail/overview/card/revenue-analysis';
import StreamsAnalysisCard from '@/modules/artist/components/artist-detail/overview/card/streams-analysis';
import { useGetDetailArtist } from '@/modules/artist/hooks/use-get-detail-artist';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type Props = {};

export default function Overview({}: Props) {
    const messages = useTranslations();
    const params = useParams();
    const artistId = params['artist-id'];
    const { artistData } = useGetDetailArtist(artistId as string);

    return (
        <div className="py-4">
            <div className="grid grid-cols-3 gap-4">
                <CountAnalysisCard
                    title={messages('release.count')}
                    number={artistData?.releaseCount}
                />
                <CountAnalysisCard
                    title={messages('track.count')}
                    number={artistData?.trackCount}
                />
                <ArtistProfileCard artistData={artistData} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
                <StreamsAnalysisCard />
                <RevenueAnalysisCard />
            </div>
            <div>
                {/* <ListRelease data={fakeReleasesData.slice(0, 7)} /> */}
            </div>
        </div>
    );
}
