'use client';
import ReleaseTracksTable from '@/modules/release-detail/release-tracks/table';
import { fakeTrackData } from '@/modules/tracks/constants/mockdata';
import { Key, useState } from 'react';

export default function Tracks() {
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);
    const handleRowSelection = (selectedRowKeys: Key[]) => {
        setSelectedRow(selectedRowKeys);
    };
    const rowSelection = {
        selectedRow,
        onChange: handleRowSelection,
    };

    return (
        <div>
            <ReleaseTracksTable
                dataSource={fakeTrackData}
                rowSelection={rowSelection}
            />
        </div>
    );
}
