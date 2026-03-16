import { convertSecondsToTime } from '@/helpers/common';
import { CustomerServiceOutlined } from '@ant-design/icons';
import { Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React from 'react';
import type { DraftTrack, JobStatus } from '../types';

const { Text } = Typography;

// ── Columns ─────────────────────────────────────────────────────────

const trackColumns: ColumnsType<DraftTrack> = [
    {
        title: '#',
        dataIndex: 'index',
        width: 50,
        render: (_: any, __: any, idx: number) => idx + 1,
    },
    {
        title: 'Filename',
        dataIndex: 'filename',
        ellipsis: true,
        render: (name: string) => (
            <Space>
                <CustomerServiceOutlined style={{ color: '#1677ff' }} />
                <Text>{name}</Text>
            </Space>
        ),
    },
    {
        title: 'Duration',
        dataIndex: 'durationSec',
        width: 100,
        render: (sec: number) => convertSecondsToTime(sec),
    },
    {
        title: 'Size (MB)',
        dataIndex: 'sizeMB',
        width: 100,
        render: (mb: number) => `${mb}`,
    },
    {
        title: 'Status',
        dataIndex: 'status',
        width: 130,
        render: (status: JobStatus) => {
            const map: Record<JobStatus, { color: string; label: string }> = {
                pending: { color: 'default', label: 'PENDING' },
                uploading: { color: 'processing', label: 'UPLOADING' },
                processing: { color: 'warning', label: 'PROCESSING' },
                done: { color: 'success', label: 'DONE' },
            };
            const { color, label } = map[status];
            return <Tag color={color}>{label}</Tag>;
        },
    },
];

// ── Component ───────────────────────────────────────────────────────

interface TracksTableProps {
    tracks: DraftTrack[];
}

const TracksTable: React.FC<TracksTableProps> = React.memo(({ tracks }) => (
    <Table<DraftTrack>
        dataSource={tracks}
        columns={trackColumns}
        rowKey="id"
        pagination={false}
        size="small"
        scroll={{ x: 600 }}
    />
));

TracksTable.displayName = 'TracksTable';

export default TracksTable;
