import { ORDER } from '@/enums/common';
import { Tabs, TabsProps } from 'antd';
import { useTranslations } from 'next-intl';
import TopStreamsTable from './top-streams-table';

type Props = {
    className?: string;
};

export default function ListTop({ className }: Props) {
    const messages = useTranslations();
    const tabItems: TabsProps['items'] = [
        {
            key: 'release',
            label: messages('release.label'),
            children: (
                <TopStreamsTable
                    titleHeader="Top releases"
                    dataFilter={{}}
                    orderByField={undefined}
                    orderField={ORDER.ASC}
                    pagination={{ pageSize: 10, current: 1 }}
                    dataSource={[
                        { id: 10, name: 'Aurora Nights', total: 23400 },
                        { id: 5, name: 'Falling Leaves', total: 22100 },
                        { id: 2, name: 'Summer Breeze', total: 19820 },
                        { id: 7, name: 'City Lights', total: 19500 },
                        { id: 9, name: 'Wanderlust', total: 18990 },
                        { id: 8, name: 'Silent Rain', total: 16780 },
                        { id: 3, name: 'Neon Dreams', total: 15340 },
                        { id: 6, name: 'Golden Horizon', total: 14230 },
                        { id: 1, name: 'Midnight Echoes', total: 12450 },
                        { id: 4, name: 'Ocean Whispers', total: 8750 },
                    ]}
                />
            ),
        },
        {
            key: 'track',
            label: messages('track.label'),
            children: (
                <TopStreamsTable
                    titleHeader="Top tracks"
                    dataFilter={{}}
                    orderByField={undefined}
                    orderField={ORDER.ASC}
                    pagination={{ pageSize: 10, current: 1 }}
                    dataSource={[
                        { id: 7, name: 'City Pop Nights', total: 7200 },
                        { id: 10, name: 'Starlight Whisper', total: 6700 },
                        { id: 5, name: 'Golden Hour', total: 6100 },
                        { id: 9, name: 'Ocean Drive', total: 5800 },
                        { id: 2, name: 'Midnight Coffee', total: 5400 },
                        { id: 3, name: 'Chasing Dreams', total: 4800 },
                        { id: 6, name: 'Raindrop Melody', total: 4300 },
                        { id: 8, name: 'Autumn Jazz', total: 3900 },
                        { id: 1, name: 'Lost in the Waves', total: 3200 },
                        { id: 4, name: 'Silent Streets', total: 2600 },
                    ]}
                />
            ),
        },
        {
            key: 'label',
            label: messages('label.label'),
            children: (
                <TopStreamsTable
                    titleHeader="Top labels"
                    dataFilter={{}}
                    orderByField={undefined}
                    orderField={ORDER.ASC}
                    pagination={{ pageSize: 10, current: 1 }}
                    dataSource={[
                        { id: 10, name: 'Starlight Entertainment', total: 400 },
                        { id: 4, name: 'Oceanic Tunes', total: 340 },
                        { id: 7, name: 'Sunset Vibes', total: 300 },
                        { id: 9, name: 'Velvet Night Music', total: 275 },
                        { id: 6, name: 'Aurora Beats', total: 260 },
                        { id: 2, name: 'Skyline Music', total: 210 },
                        { id: 5, name: 'Lofi Dreams Studio', total: 180 },
                        { id: 8, name: 'Echo Chamber Records', total: 150 },
                        { id: 1, name: 'IndieWave Records', total: 120 },
                        { id: 3, name: 'Golden Gate Sounds', total: 95 },
                    ]}
                />
            ),
        },
        {
            key: 'artist',
            label: messages('artist.label'),
            children: (
                <TopStreamsTable
                    titleHeader="Top artists"
                    dataFilter={{}}
                    orderByField={undefined}
                    orderField={ORDER.ASC}
                    pagination={{ pageSize: 10, current: 1 }}
                    dataSource={[
                        { id: 2, name: 'Kai Nakamura', total: 187500 },
                        { id: 7, name: 'Maya Santos', total: 174800 },
                        { id: 5, name: 'Aiko Tanaka', total: 165400 },
                        { id: 9, name: 'Hana Suzuki', total: 143600 },
                        { id: 1, name: 'Luna Rivera', total: 152000 },
                        { id: 3, name: 'Sofia Marquez', total: 134200 },
                        { id: 6, name: 'Ethan Cole', total: 121300 },
                        { id: 8, name: 'Leo Martins', total: 110500 },
                        { id: 10, name: 'Oliver Hayes', total: 102900 },
                        { id: 4, name: 'Noah Bennett', total: 98000 },
                    ]}
                />
            ),
        },
        {
            key: 'dsp',
            label: 'DSP',
            children: (
                <TopStreamsTable
                    titleHeader="Top DSPs"
                    dataFilter={{}}
                    orderByField={undefined}
                    orderField={ORDER.ASC}
                    pagination={{ pageSize: 10, current: 1 }}
                    dataSource={[
                        { id: 1, name: 'Spotify', total: 12500 },
                        { id: 2, name: 'Apple Music', total: 9800 },
                        { id: 3, name: 'YouTube Music', total: 8700 },
                        { id: 4, name: 'Amazon Music', total: 6400 },
                        { id: 5, name: 'Deezer', total: 5100 },
                        { id: 6, name: 'Tidal', total: 4300 },
                        { id: 7, name: 'SoundCloud', total: 3800 },
                        { id: 8, name: 'Napster', total: 2100 },
                        { id: 9, name: 'Pandora', total: 1600 },
                        { id: 10, name: 'Anghami', total: 1200 },
                    ]}
                />
            ),
        },
        {
            key: 'partners',
            label: 'Partners',
            children: (
                <TopStreamsTable
                    titleHeader="Top partners"
                    dataFilter={{}}
                    orderByField={undefined}
                    orderField={ORDER.ASC}
                    pagination={{ pageSize: 10, current: 1 }}
                    dataSource={[
                        { id: 1, name: 'Universal Music Group', total: 15000 },
                        {
                            id: 2,
                            name: 'Sony Music Entertainment',
                            total: 13200,
                        },
                        { id: 3, name: 'Warner Music Group', total: 11800 },
                        { id: 4, name: 'Believe Digital', total: 9400 },
                        { id: 5, name: 'Empire Distribution', total: 8600 },
                        { id: 6, name: 'Ditto Music', total: 7200 },
                        { id: 7, name: 'CD Baby', total: 6100 },
                        { id: 8, name: 'TuneCore', total: 5800 },
                        { id: 9, name: 'DistroKid', total: 5300 },
                        { id: 10, name: 'Repost by SoundCloud', total: 4800 },
                    ]}
                />
            ),
        },
    ];
    return (
        <div className="overflow-hidden rounded-lg border">
            <Tabs
                items={tabItems}
                className="tab-mb-0 rounded-lg bg-white [&_.ant-tabs-nav]:px-4"
            />
            {/* <div
                className={`grid gap-4 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-3 ${className}`}
            > */}
            {/* <AppPagination
                        current={1}
                        pageSize={10}
                        total={3}
                        align="center"
                        showTotalText
                    /> */}

            {/* <AppPagination
                        current={1}
                        pageSize={10}
                        total={3}
                        align="center"
                        showTotalText
                    /> */}
            {/* </div> */}
        </div>
    );
}
