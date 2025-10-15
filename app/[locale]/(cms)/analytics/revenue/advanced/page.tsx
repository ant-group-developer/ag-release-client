'use client';
import { cn } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import DspChart from '@/modules/analytics/chart/dsp-chart';
import { AnalyticArtistTable } from '@/modules/analytics/revenue/advanced/artist-table';
import { REVENUE_ADVANCED } from '@/modules/analytics/revenue/advanced/enums';
import HeaderFilter from '@/modules/analytics/revenue/advanced/filter';
import Header from '@/modules/analytics/revenue/advanced/header';
import { AnalyticLabelTable } from '@/modules/analytics/revenue/advanced/label-table';
import SideMenu from '@/modules/analytics/revenue/advanced/side-menu';
import { AnalyticTrackTable } from '@/modules/analytics/revenue/advanced/track-table';
import { RevenueAdvancedDataFilter } from '@/modules/analytics/revenue/advanced/types';
import { Button, Card, TableProps } from 'antd';
import dayjs from 'dayjs';
import { Key, useState } from 'react';
import { AnalyticReleaseTable } from '../../../../../../modules/analytics/revenue/advanced/release-table';

type Props = {};

export default function Advanced({}: Props) {
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);
    const [openFilter, setOpenFilter] = useState(true);
    // const messages = useTranslations();

    const { dataFilter, onChangeFilter } = useFilter<RevenueAdvancedDataFilter>(
        {
            startCreatedAt: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
            endCreatedAt: dayjs().format('YYYY-MM-DD'),
            analyticsType: REVENUE_ADVANCED.RELEASES,
        }
    );

    // func
    const handleResetSelectedRow = () => {
        setSelectedRow([]);
    };
    const handleSelectedRow = (selectedRowKeys: Key[], selectedRows: any) => {
        setSelectedRow(selectedRowKeys);
    };
    const toggleFilter = () => {
        setOpenFilter(!openFilter);
    };

    // const
    const rowSelection: TableProps<any>['rowSelection'] = {
        selectedRowKeys: selectedRow,
        onChange: handleSelectedRow,
        columnWidth: 40,
    };

    const fakeDataSource: any[] = Array.from({ length: 20 }, (_, i) => {
        const id = (i + 1).toString();
        const titles = [
            'Summer Nights',
            'Morning Jazz',
            'City Pop Dreams',
            'Ocean Breeze',
            'Midnight Rain',
            'Golden Hour',
            'Sunset Drive',
            'Blue Horizon',
            'Neon Lights',
            'Silent Forest',
        ];
        const artists = [
            'Lofi Chill',
            'Smooth Quartet',
            'Retro Vibes',
            'Chillhop Beats',
            'Dreamy Sounds',
            'Indie Flow',
            'Jazz Collective',
            'Urban Soul',
            'Electro Mood',
            'Acoustic Wave',
        ];

        return {
            key: id,
            id,
            name: titles[i % titles.length],
            artist: artists[i % artists.length],
            streams: Math.floor(Math.random() * 20000) + 1000, // 1k – 20k
            revenue: `${(Math.random() * 200 + 20).toFixed(2)}`, // $20 – $220
        };
    });

    return (
        <div className="fixed inset-0 z-50 mt-[50px] overflow-y-auto bg-white">
            <Header />

            <div className="flex">
                <SideMenu open={openFilter} />

                <div
                    className={cn(
                        'bg-main flex-1 space-y-6 overflow-y-auto px-10 py-4 pl-[calc(18rem+2.5rem)]',
                        { 'pl-10': !openFilter }
                    )}
                >
                    <HeaderFilter
                        dataFilter={dataFilter}
                        onChangeFilter={onChangeFilter}
                        toggleFilter={toggleFilter}
                    />

                    <Card
                        styles={{ body: { padding: '8px' } }}
                        title={'Revenue Dsps'}
                    >
                        <div className="h-[300px] rounded-lg bg-white">
                            <DspChart />
                        </div>
                    </Card>

                    {dataFilter?.analyticsType ===
                        REVENUE_ADVANCED.RELEASES && (
                        <AnalyticReleaseTable
                            dataSource={fakeDataSource}
                            rowSelection={rowSelection}
                        />
                    )}

                    {dataFilter?.analyticsType === REVENUE_ADVANCED.TRACKS && (
                        <AnalyticTrackTable
                            dataSource={fakeDataSource}
                            rowSelection={rowSelection}
                        />
                    )}

                    {dataFilter?.analyticsType === REVENUE_ADVANCED.LABELS && (
                        <AnalyticLabelTable
                            dataSource={fakeDataSource}
                            rowSelection={rowSelection}
                        />
                    )}

                    {dataFilter?.analyticsType === REVENUE_ADVANCED.ARTISTS && (
                        <AnalyticArtistTable
                            dataSource={fakeDataSource}
                            rowSelection={rowSelection}
                        />
                    )}

                    <div className="mt-4 flex justify-center">
                        <Button shape="round">Load more</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
