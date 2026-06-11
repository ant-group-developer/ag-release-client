import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { Modal, Table, Tag } from 'antd';
import { useTranslations } from 'next-intl';
import { ReleaseSubmitLogsData } from '../../types';

type Props = {
    open: boolean;
    onClose: () => void;
    logs: ReleaseSubmitLogsData[];
};

export default function StepLogsModal({ open, onClose, logs }: Props) {
    const messages = useTranslations();

    return (
        <Modal
            title={messages('releaseExecution.detail.columns.logs')}
            open={open}
            onCancel={onClose}
            footer={null}
            className="!w-[70vw]"
            centered
        >
            <Table<ReleaseSubmitLogsData>
                dataSource={logs}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                    {
                        title: messages(
                            'releaseExecution.detail.columns.logTime'
                        ),
                        dataIndex: 'createdAt',
                        key: 'createdAt',
                        width: 150,
                        render: (value) =>
                            value
                                ? formattedDate(value, DATE_FORMAT.DATE_MINUTE)
                                : '-',
                    },
                    {
                        title: messages(
                            'releaseExecution.detail.columns.logLevel'
                        ),
                        dataIndex: 'level',
                        key: 'level',
                        width: 100,
                        render: (value) => {
                            const color =
                                value === 'ERROR'
                                    ? 'red'
                                    : value === 'WARNING'
                                      ? 'orange'
                                      : 'blue';
                            return <Tag color={color}>{value}</Tag>;
                        },
                    },
                    {
                        title: messages(
                            'releaseExecution.detail.columns.logMessage'
                        ),
                        dataIndex: 'message',
                        key: 'message',
                    },
                ]}
            />
        </Modal>
    );
}
