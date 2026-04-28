import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Eye } from 'lucide-react';
import {
    formatDurationShort,
    formatEnumLabel,
    getReleaseSubmitStepStatusColor,
} from '../../helpers';
import { ReleaseSubmitLogsData, ReleaseSubmitStepData } from '../../types';

type Props = {
    dataSource: ReleaseSubmitStepData[];
    logs?: ReleaseSubmitLogsData[];
    onViewDetail: (step: ReleaseSubmitStepData) => void;
};

export default function ReleaseSubmitStepTable({
    dataSource,
    logs = [],
    onViewDetail,
}: Props) {
    const columns: ColumnsType<ReleaseSubmitStepData> = [
        {
            title: 'Step type',
            dataIndex: 'type',
            key: 'type',
            width: 220,
            render: (value) => formatEnumLabel(value),
        },
        {
            title: 'DSP',
            dataIndex: 'dsp',
            key: 'dsp',
            width: 160,
            render: (_, record) => record?.dsp?.name || '-',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (value) => (
                <Tag color={getReleaseSubmitStepStatusColor(value)}>
                    {formatEnumLabel(value)}
                </Tag>
            ),
        },
        {
            title: 'Started',
            dataIndex: 'startedAt',
            key: 'startedAt',
            width: 150,
            render: (value) =>
                value ? formattedDate(value, DATE_FORMAT.DATE_MINUTE) : '-',
        },
        {
            title: 'Completed',
            dataIndex: 'completedAt',
            key: 'completedAt',
            width: 150,
            render: (value) =>
                value ? formattedDate(value, DATE_FORMAT.DATE_MINUTE) : '-',
        },
        {
            title: 'Duration',
            key: 'duration',
            width: 140,
            render: (_, record) =>
                formatDurationShort(record?.startedAt, record?.completedAt) ||
                '-',
        },
        {
            title: 'Retry',
            dataIndex: 'retryCount',
            key: 'retryCount',
            width: 80,
            align: 'center',
        },
        {
            title: 'Logs',
            key: 'logs',
            width: 80,
            align: 'center',
            render: (_, record) => {
                const count = logs.filter(
                    (log) => log.releaseSubmitStepId === record.id
                ).length;
                return count || '-';
            },
        },
        {
            title: '',
            key: 'actions',
            width: 70,
            fixed: 'right',
            align: 'center',
            render: (_, record) => (
                <IconButton onClick={() => onViewDetail(record)}>
                    <Eye size={SIZE_ICON} />
                </IconButton>
            ),
        },
    ];

    return (
        <Table<ReleaseSubmitStepData>
            rowKey="id"
            size="small"
            pagination={false}
            dataSource={dataSource}
            columns={columns}
            scroll={{ x: 1150 }}
            expandable={{
                rowExpandable: (record) => !!record.childSteps?.length,
                expandedRowRender: (record) => (
                    <div className="rounded-md border">
                        <ReleaseSubmitStepTable
                            dataSource={record.childSteps}
                            logs={logs}
                            onViewDetail={onViewDetail}
                        />
                    </div>
                ),
            }}
        />
    );
}
