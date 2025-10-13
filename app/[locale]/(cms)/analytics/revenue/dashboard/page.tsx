'use client';
import ChartSwitcher from '@/components/ui/chart/chart-switcher';
import { useRouter } from '@/i18n/routing';
import DspChart from '@/modules/analytics/chart/dsp-chart';
import { useTranslations } from 'next-intl';

type Props = {};

export default function Revenue({}: Props) {
    const messages = useTranslations();
    const router = useRouter();
    const topReleases = [
        { id: 10, name: 'Aurora Nights', value: 23400 },
        { id: 5, name: 'Falling Leaves', value: 22100 },
        { id: 2, name: 'Summer Breeze', value: 19820 },
        { id: 7, name: 'City Lights', value: 19500 },
        { id: 9, name: 'Wanderlust', value: 18990 },
        { id: 8, name: 'Silent Rain', value: 16780 },
        { id: 3, name: 'Neon Dreams', value: 15340 },
        { id: 6, name: 'Golden Horizon', value: 14230 },
        { id: 1, name: 'Midnight Echoes', value: 12450 },
        { id: 4, name: 'Ocean Whispers', value: 8750 },
    ];
    const topTrack = [
        { id: 7, name: 'City Pop Nights', value: 7200 },
        { id: 10, name: 'Starlight Whisper', value: 6700 },
        { id: 5, name: 'Golden Hour', value: 6100 },
        { id: 9, name: 'Ocean Drive', value: 5800 },
        { id: 2, name: 'Midnight Coffee', value: 5400 },
        { id: 3, name: 'Chasing Dreams', value: 4800 },
        { id: 6, name: 'Raindrop Melody', value: 4300 },
        { id: 8, name: 'Autumn Jazz', value: 3900 },
        { id: 1, name: 'Lost in the Waves', value: 3200 },
        { id: 4, name: 'Silent Streets', value: 2600 },
    ];
    const topArtist = [
        { id: 2, name: 'Kai Nakamura', value: 187500 },
        { id: 7, name: 'Maya Santos', value: 174800 },
        { id: 5, name: 'Aiko Tanaka', value: 165400 },
        { id: 9, name: 'Hana Suzuki', value: 143600 },
        { id: 1, name: 'Luna Rivera', value: 152000 },
        { id: 3, name: 'Sofia Marquez', value: 134200 },
        { id: 6, name: 'Ethan Cole', value: 121300 },
        { id: 8, name: 'Leo Martins', value: 110500 },
        { id: 10, name: 'Oliver Hayes', value: 102900 },
        { id: 4, name: 'Noah Bennett', value: 98000 },
    ];
    const topLabels = [
        { id: 10, name: 'Starlight Entertainment', value: 400 },
        { id: 4, name: 'Oceanic Tunes', value: 340 },
        { id: 7, name: 'Sunset Vibes', value: 300 },
        { id: 9, name: 'Velvet Night Music', value: 275 },
        { id: 6, name: 'Aurora Beats', value: 260 },
        { id: 2, name: 'Skyline Music', value: 210 },
        { id: 5, name: 'Lofi Dreams Studio', value: 180 },
        { id: 8, name: 'Echo Chamber Records', value: 150 },
        { id: 1, name: 'IndieWave Records', value: 120 },
        { id: 3, name: 'Golden Gate Sounds', value: 95 },
    ];
    return (
        <div className="flex flex-col gap-4">
            <div className="h-[300px] rounded-lg border bg-white">
                <DspChart />
            </div>
            <div
                className={`grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2`}
            >
                <div className="h-[450px]">
                    <ChartSwitcher
                        title="Top releases"
                        data={topReleases}
                        className="h-full"
                    />
                </div>
                <div className="h-[450px]">
                    <ChartSwitcher
                        title="Top tracks"
                        data={topTrack}
                        className="h-full"
                    />
                </div>
                <div className="h-[450px]">
                    <ChartSwitcher
                        title="Top artists"
                        data={topArtist}
                        className="h-full"
                    />
                </div>
                <div className="h-[450px]">
                    <ChartSwitcher
                        title="Top labels"
                        data={topLabels}
                        className="h-full"
                    />
                </div>
            </div>
        </div>
    );
}
