import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { Table, Tag, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { STEP_STATUS } from '../../enums';
import { formatDurationShort, getStepStatusColor } from '../../helpers';
import { StepData } from '../../types';

type Props = {
    dataSource: StepData[];
};

export default function ReleaseExecutionStepTable({ dataSource }: Props) {
    const messages = useTranslations();

    const getStepTypeLabel = (value?: string | null) => {
        if (!value) return '-';
        return messages(`releaseExecution.stepTypeOptions.${value}` as any);
    };

    return (
        <Table<StepData>
            size="small"
            rowKey="id"
            pagination={false}
            dataSource={dataSource}
            scroll={{ x: 760 }}
            columns={[
                {
                    title: messages('releaseExecution.columns.stepType'),
                    dataIndex: 'stepType',
                    key: 'stepType',
                    width: 220,
                    render: (_, record) => getStepTypeLabel(record?.stepType),
                },
                {
                    title: messages('common.status'),
                    dataIndex: 'status',
                    key: 'status',
                    width: 140,
                    render: (_, record) => (
                        <Tag
                            color={getStepStatusColor(
                                record?.status as STEP_STATUS
                            )}
                        >
                            {messages(
                                `releaseExecution.stepStatus.${record?.status}` as any
                            )}
                        </Tag>
                    ),
                },
                {
                    title: messages('releaseExecution.columns.startedAt'),
                    dataIndex: 'startedAt',
                    key: 'startedAt',
                    width: 160,
                    render: (value) =>
                        value
                            ? formattedDate(value, DATE_FORMAT.DATE_MINUTE)
                            : '-',
                },
                {
                    title: messages('releaseExecution.columns.completedAt'),
                    dataIndex: 'completedAt',
                    key: 'completedAt',
                    width: 160,
                    render: (value) =>
                        value
                            ? formattedDate(value, DATE_FORMAT.DATE_MINUTE)
                            : '-',
                },
                {
                    title: messages('common.duration'),
                    key: 'duration',
                    width: 140,
                    render: (_, record) =>
                        formatDurationShort(
                            record?.startedAt,
                            record?.completedAt
                        ) || '-',
                },
            ]}
            expandable={{
                columnWidth: 20,
                rowExpandable: (record) => !!record.logs,
                expandedRowRender: (record) => (
                    <div className="px-4 py-2">
                        <Typography.Text>{record?.logs}</Typography.Text>
                    </div>
                ),
            }}
        />
    );
}
