'use client';
import { ORDER } from '@/enums/common';
import { useRouter } from '@/i18n/routing';
import DspChart from '@/modules/dashboard/components/area-chart/dsp-chart';
import TopRevenueTable from '@/modules/dashboard/components/list-top/top-revenue-table';
import { useTranslations } from 'next-intl';

type Props = {};

export default function Revenue({}: Props) {
    const messages = useTranslations();
    const router = useRouter();
    return (
        <div className="flex flex-col gap-4 p-4">
            <DspChart />
            <div
                className={`grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2`}
            >
                <TopRevenueTable
                    titleHeader="Top releases"
                    headerButtonText={messages('common.seeMore')}
                    headerButtonProps={{
                        onClick: () => {
                            router.push('/analytics/revenue/advanced');
                        },
                    }}
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
                <TopRevenueTable
                    titleHeader="Top tracks"
                    headerButtonText={messages('common.seeMore')}
                    headerButtonProps={{
                        onClick: () => {
                            router.push('/analytics/revenue/advanced');
                        },
                    }}
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
                {/* <AppPagination
                                current={1}
                                pageSize={10}
                                total={3}
                                align="center"
                                showTotalText
                            /> */}
                <TopRevenueTable
                    titleHeader="Top artists"
                    headerButtonText={messages('common.seeMore')}
                    headerButtonProps={{
                        onClick: () => {
                            router.push('/analytics/revenue/advanced');
                        },
                    }}
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

                <TopRevenueTable
                    titleHeader="Top labels"
                    headerButtonText={messages('common.seeMore')}
                    headerButtonProps={{
                        onClick: () => {
                            router.push('/analytics/revenue/advanced');
                        },
                    }}
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
            </div>
        </div>
    );
}
