'use client';
import IconButton from '@/components/ui/button/icon-button';
import AppTable from '@/components/ui/table/normal-table';
import { SIZE_ICON } from '@/constants/common';
import { Link } from '@/i18n/routing';
import DspChart from '@/modules/dashboard/components/area-chart/dsp-chart';
import { Button } from 'antd';
import { ColumnType } from 'antd/es/table';
import { X } from 'lucide-react';
import { Key, useState } from 'react';

type Props = {};

export default function Advanced({}: Props) {
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);
    const columns: ColumnType<any>[] = [
        {
            title: 'Title',
            dataIndex: 'name',
            key: 'name',
            width: 800,
            fixed: 'left',
        },
        {
            title: 'Artist',
            dataIndex: 'artist',
            key: 'artist',
        },
        {
            title: 'Streams',
            dataIndex: 'streams',
            key: 'streams',
        },
        {
            title: 'Revenue',
            dataIndex: 'revenue',
            key: 'revenue',
        },
    ];
    const handleSelectedRow = (selectedRowKeys: Key[]) => {
        setSelectedRow(selectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys: selectedRow,
        onChange: handleSelectedRow,
        columnWidth: 20,
    };

    const dataSource = [
        {
            key: '1',
            name: 'Title ',
            artist: 'Artist',
            streams: 1000,
            revenue: '$1000',
        },
        {
            key: '2',
            name: 'Title 2',
            artist: 'Artist 2',
            streams: 2000,
            revenue: '$2000',
        },
    ];

    return (
        <div className="fixed inset-0 z-50 bg-white">
            <div className="sticky top-0 flex items-center justify-between border bg-white px-6 py-2">
                <span className="font-semibold">Advanced analytics</span>
                <Link href="/analytics/revenue/dashboard">
                    <IconButton>
                        <X size={SIZE_ICON} />
                    </IconButton>
                </Link>
            </div>
            <div className="space-y-6 p-6">
                <div className="space-x-2">
                    <Button shape="round">Track</Button>
                    <Button shape="round" type="primary">
                        Release
                    </Button>
                    <Button shape="round">Artist</Button>
                    <Button shape="round">Label</Button>
                </div>
                <DspChart />
                <AppTable
                    columns={columns}
                    dataSource={dataSource}
                    // rowSelection={rowSelection}
                />
                <div className="mt-4 flex justify-center">
                    <Button shape="round">Load more</Button>
                </div>
            </div>
        </div>
    );
}
