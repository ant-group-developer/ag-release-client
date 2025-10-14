'use client';
import IconButton from '@/components/ui/button/icon-button';
import AppSearch from '@/components/ui/input/search';
import DateSelect from '@/components/ui/select/date-select';
import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import { Link } from '@/i18n/routing';
import DspChart from '@/modules/analytics/chart/dsp-chart';
import { Button, Checkbox, Menu, TableProps, theme } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import dayjs from 'dayjs';
import { Download, Filter, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Key, useState } from 'react';
import { AdvancedRevenueTable } from './advanced-revenue-table';

type Props = {};

export default function Advanced({}: Props) {
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);
    const [openFilter, setOpenFilter] = useState(true);
    const messages = useTranslations();
    const { token } = theme.useToken();

    const { dataFilter, onChangeFilter } = useFilter({
        startCreatedAt: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
        endCreatedAt: dayjs().format('YYYY-MM-DD'),
    });

    // func
    const handleResetSelectedRow = () => {
        setSelectedRow([]);
    };
    const handleSelectedRow = (selectedRowKeys: Key[]) => {
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
            revenue: `$${(Math.random() * 200 + 20).toFixed(2)}`, // $20 – $220
        };
    });

    const items: ItemType[] = [
        {
            key: '0',
            type: 'group',
            label: <p className="font-semibold">Filters</p>,
        },
        {
            key: '0.5',
            type: 'divider',
        },
        {
            key: '1',
            label: <p className="font-semibold">Included DSPs</p>,
            children: [
                {
                    key: '1.1',
                    label: <AppSearch />,
                    children: [
                        {
                            key: '1.1.1',
                            label: <Checkbox> Test </Checkbox>,
                        },
                        {
                            key: '1.1.1',
                            label: <Checkbox> Test </Checkbox>,
                        },
                        {
                            key: '1.1.1',
                            label: <Checkbox> Test </Checkbox>,
                        },
                    ],
                },
            ],
        },
        {
            key: '2',
            label: <p className="font-semibold">Labels</p>,
            children: [
                {
                    key: '2.1',
                    label: <AppSearch />,
                },
            ],
        },
        {
            key: '3',
            label: <p className="font-semibold">Artists</p>,
            children: [
                {
                    key: '3.1',
                    label: <AppSearch />,
                },
            ],
        },
        {
            key: '4',
            label: <p className="font-semibold">Releases</p>,
            children: [
                {
                    key: '4.1',
                    label: <AppSearch />,
                },
            ],
        },
        {
            key: '5',
            label: <p className="font-semibold">Tracks</p>,
            children: [
                {
                    key: '5.1',
                    label: <AppSearch />,
                },
            ],
        },
    ];

    return (
        <div className="fixed inset-0 z-50 mt-[50px] overflow-y-auto bg-white">
            <div className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between border bg-white px-6 py-2">
                <span className="text-lg font-semibold">
                    Advanced analytics
                </span>
                <Link href="/analytics/dashboard">
                    <IconButton>
                        <X size={SIZE_ICON} />
                    </IconButton>
                </Link>
            </div>

            <div className="flex">
                <div
                    className={cn(
                        'fixed left-0 top-0 w-72 transition-all duration-700 ease-in-out',
                        {
                            'w-0': !openFilter,
                        }
                    )}
                >
                    <Menu
                        items={items}
                        style={{ backgroundColor: token.colorBgContainer }}
                        className={cn('custom-filter-menu !mt-12 h-screen', {
                            hidden: !openFilter,
                        })}
                        mode="inline"
                    />
                </div>

                <div
                    className={cn(
                        'flex-1 space-y-6 overflow-y-auto p-6 pl-[312px]',
                        { 'pl-6': !openFilter }
                    )}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <Button
                                onClick={toggleFilter}
                                icon={
                                    <div>
                                        <Filter size={SIZE_ICON} />
                                    </div>
                                }
                                shape="circle"
                            />
                            <Button
                                icon={
                                    <div>
                                        <Download size={SIZE_ICON} />
                                    </div>
                                }
                                shape="circle"
                            />
                            <DateSelect
                                selectClassName="w-[150px]"
                                rangeClassName="w-[250px]"
                                externalOnChange={(fromDate, toDate) =>
                                    onChangeFilter({
                                        startCreatedAt: fromDate,
                                        endCreatedAt: toDate,
                                    })
                                }
                                value={`${dataFilter.startCreatedAt},${dataFilter.endCreatedAt}`}
                            />
                        </div>
                        <div className="space-x-2">
                            <Button shape="round">Track</Button>
                            <Button shape="round" type="primary">
                                Release
                            </Button>
                            <Button shape="round">Artist</Button>
                            <Button shape="round">Label</Button>
                        </div>
                    </div>
                    <div className="h-[300px] rounded-lg border bg-white">
                        <DspChart />
                    </div>
                    <AdvancedRevenueTable
                        dataSource={fakeDataSource}
                        rowSelection={rowSelection}
                    />
                    <div className="mt-4 flex justify-center">
                        <Button shape="round">Load more</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
