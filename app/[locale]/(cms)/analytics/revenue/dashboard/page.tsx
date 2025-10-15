'use client';
import { formattedNumber } from '@/helpers/common';
import ChartSwitcher from '@/modules/analytics/chart/chart-switcher';
import DspChart from '@/modules/analytics/chart/dsp-chart';
import { Card } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {};

export default function Revenue({}: Props) {
    const messages = useTranslations();

    const topReleases = [
        { id: 1, name: 'Old Skool Kinda Girl', value: 48327.56 },
        { id: 2, name: 'Midnight in Tokyo', value: 45783.42 },
        { id: 3, name: 'Waves of Nostalgia', value: 43219.88 },
        { id: 4, name: 'Lost Frequencies', value: 40492.37 },
        { id: 5, name: 'Neon Skyline', value: 39204.61 },
        { id: 6, name: 'Golden Hour Memories', value: 37672.94 },
        { id: 7, name: 'Silent Nights', value: 35984.23 },
        { id: 8, name: 'After Rain Comes Light', value: 34169.58 },
        { id: 9, name: 'Chasing Echoes', value: 32941.07 },
        { id: 10, name: 'Eternal Youth', value: 31312.44 },
    ];

    const topTrack = [
        { id: 1, name: 'Twenty Five and Up', value: 21543.82 },
        { id: 2, name: 'City Lights Again', value: 19847.39 },
        { id: 3, name: 'Falling for You', value: 18726.05 },
        { id: 4, name: 'The Way You Move', value: 17358.77 },
        { id: 5, name: 'Drifting Dreams', value: 16281.63 },
        { id: 6, name: 'Love Me Tonight', value: 15469.11 },
        { id: 7, name: 'Midnight Drive', value: 14638.9 },
        { id: 8, name: 'Hold On Tight', value: 13782.57 },
        { id: 9, name: 'Never Let Go', value: 12946.18 },
        { id: 10, name: 'Shades of You', value: 12113.42 },
    ];

    const topArtist = [
        { id: 1, name: 'Avail Hollywood', value: 126487.63 },
        { id: 2, name: 'Luna Rivera', value: 118392.48 },
        { id: 3, name: 'Aiko Tanaka', value: 112347.11 },
        { id: 4, name: 'Kai Nakamura', value: 109871.9 },
        { id: 5, name: 'Noah Bennett', value: 101276.54 },
        { id: 6, name: 'Hana Suzuki', value: 97214.83 },
        { id: 7, name: 'Sofia Marquez', value: 94828.29 },
        { id: 8, name: 'Ethan Cole', value: 90361.92 },
        { id: 9, name: 'Leo Martins', value: 86459.7 },
        { id: 10, name: 'Maya Santos', value: 82248.15 },
    ];

    const topLabels = [
        { id: 1, name: 'Avail Hollywood', value: 875.23 },
        { id: 2, name: 'Midnight Records', value: 828.74 },
        { id: 3, name: 'Sunset Vibes', value: 793.66 },
        { id: 4, name: 'Echo Chamber Records', value: 741.38 },
        { id: 5, name: 'Golden Gate Sounds', value: 698.52 },
        { id: 6, name: 'Oceanic Tunes', value: 657.09 },
        { id: 7, name: 'IndieWave Records', value: 615.82 },
        { id: 8, name: 'Starlight Entertainment', value: 582.94 },
        { id: 9, name: 'Skyline Music', value: 547.33 },
        { id: 10, name: 'Aurora Beats', value: 512.77 },
    ];
    return (
        <div className="flex flex-col gap-4">
            <Card
                className="rounded-lg border bg-white"
                title={'Revenue'}
                extra={
                    <div>
                        <span className="text-base font-semibold">
                            {messages('common.total')}:{' '}
                            {formattedNumber(323423)}
                        </span>
                    </div>
                }
            >
                <div className="h-[300px]">
                    <DspChart />
                </div>
            </Card>
            <div
                className={`grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2`}
            >
                <div className="h-[520px]">
                    <ChartSwitcher
                        title="Top releases"
                        data={topReleases}
                        className="h-full"
                        defaultChart="bar"
                    />
                </div>
                <div className="h-[520px]">
                    <ChartSwitcher
                        title="Top tracks"
                        data={topTrack}
                        className="h-full"
                        defaultChart="bar"
                    />
                </div>
                <div className="h-[520px]">
                    <ChartSwitcher
                        title="Top artists"
                        data={topArtist}
                        className="h-full"
                        defaultChart="bar"
                    />
                </div>
                <div className="h-[520px]">
                    <ChartSwitcher
                        title="Top labels"
                        data={topLabels}
                        className="h-full"
                        defaultChart="bar"
                    />
                </div>
            </div>
        </div>
    );
}
