import AppTable from '@/components/ui/table/normal-table';
import {
    ExclamationCircleOutlined,
    PlayCircleOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import {
    Button,
    Modal,
    Popconfirm,
    Popover,
    Space,
    Spin,
    Tag,
    Typography,
} from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useGetFtpReportFileDiscoveryRuns } from '../../hooks/use-get-ftp-report-file-discovery-runs';
import { useResetFtpReportFileDiscovery } from '../../hooks/use-reset-ftp-report-file-discovery';
import { FtpReportFileDiscoveryRun } from '../../types';
import { RunFtpFileDiscoveryModal } from './run-ftp-file-discovery-modal';

interface FtpFileDiscoveryRunsModalProps {
    open: boolean;
    onCancel: () => void;
}

const StatusTag = ({ status }: { status: string }) => {
    const messages = useTranslations();
    const colorMap: Record<string, string> = {
        running: 'processing',
        completed: 'success',
        success: 'success',
        completed_with_warnings: 'warning',
        failed: 'error',
        error: 'error',
    };

    const labelMap: Record<string, string> = {
        running: messages('dspReport.fileDiscoveryRuns.status.running'),
        completed: messages('dspReport.fileDiscoveryRuns.status.completed'),
        success: messages('dspReport.fileDiscoveryRuns.status.completed'),
        completed_with_warnings: messages(
            'dspReport.fileDiscoveryRuns.status.completedWithWarnings'
        ),
        failed: messages('dspReport.fileDiscoveryRuns.status.failed'),
        error: messages('dspReport.fileDiscoveryRuns.status.failed'),
    };

    return (
        <Tag color={colorMap[status] || 'default'}>
            {labelMap[status] || status}
        </Tag>
    );
};

const ErrorMessageCell = ({ message }: { message?: string }) => {
    if (!message) return <Typography.Text type="secondary">-</Typography.Text>;

    return (
        <Popover
            content={
                <div className="max-w-xs break-words">
                    <Typography.Text type="danger">{message}</Typography.Text>
                </div>
            }
            trigger="hover"
        >
            <Typography.Text type="danger" className="cursor-pointer">
                <ExclamationCircleOutlined style={{ fontSize: 16 }} />
            </Typography.Text>
        </Popover>
    );
};

export const FtpFileDiscoveryRunsModal = ({
    open,
    onCancel,
}: FtpFileDiscoveryRunsModalProps) => {
    const messages = useTranslations();
    const [isRunModalOpen, setIsRunModalOpen] = useState(false);
    const { discoveryRuns, isLoading } = useGetFtpReportFileDiscoveryRuns(open);
    const { resetFtpReportFileDiscovery, isPending: isResetting } =
        useResetFtpReportFileDiscovery();

    const columns: ColumnType<FtpReportFileDiscoveryRun>[] = [
        {
            title: messages('common.iNo'),
            key: 'stt',
            width: 60,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
            width: 220,
            ellipsis: true,
            render: (text: string) => (
                <Typography.Text copyable className="font-mono">
                    {text}
                </Typography.Text>
            ),
        },
        {
            title: messages('dspReport.table.source'),
            key: 'source',
            dataIndex: 'source',
            width: 90,
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: 'status',
            width: 120,
            render: (text: string) => <StatusTag status={text} />,
        },
        {
            title: messages(
                'dspReport.fileDiscoveryRuns.columns.foldersScanned'
            ),
            key: 'folders_scanned',
            dataIndex: 'folders_scanned',
            width: 130,
            align: 'right',
        },
        {
            title: messages('dspReport.fileDiscoveryRuns.columns.filesScanned'),
            key: 'files_scanned',
            dataIndex: 'files_scanned',
            width: 120,
            align: 'right',
        },
        {
            title: messages(
                'dspReport.fileDiscoveryRuns.columns.patternsUpserted'
            ),
            key: 'patterns_upserted',
            dataIndex: 'patterns_upserted',
            width: 140,
            align: 'right',
        },
        {
            title: messages('common.startedAt'),
            key: 'started_at',
            dataIndex: 'started_at',
            width: 160,
            render: (text: string) => (
                <Typography.Text type="secondary">{text}</Typography.Text>
            ),
        },
        {
            title: messages('common.completedAt'),
            key: 'completed_at',
            dataIndex: 'completed_at',
            width: 160,
            render: (text: string) => (
                <Typography.Text type="secondary">
                    {text || '-'}
                </Typography.Text>
            ),
        },
        {
            title: messages('common.errorMessage'),
            key: 'error_message',
            dataIndex: 'error_message',
            width: 120,
            align: 'center',
            render: (text: string) => <ErrorMessageCell message={text} />,
        },
    ];

    return (
        <>
            <Modal
                title={
                    <div className="flex items-center justify-between pr-10">
                        <span>{messages('dspReport.fileDiscoveryRuns.title')}</span>
                        <Space>
                            <Button
                                type="primary"
                                size="small"
                                icon={<PlayCircleOutlined />}
                                onClick={() => setIsRunModalOpen(true)}
                            >
                                {messages(
                                    'dspReport.fileDiscoveryRuns.runButton'
                                )}
                            </Button>
                            <Popconfirm
                                title={messages(
                                    'dspReport.fileDiscoveryRuns.resetButton'
                                )}
                                description={messages(
                                    'dspReport.fileDiscoveryRuns.resetConfirm'
                                )}
                                onConfirm={() => resetFtpReportFileDiscovery()}
                                okText={messages('common.submit')}
                                cancelText={messages('common.remove')}
                            >
                                <Button
                                    type="primary"
                                    danger
                                    size="small"
                                    icon={<ReloadOutlined />}
                                    loading={isResetting}
                                >
                                    {messages(
                                        'dspReport.fileDiscoveryRuns.resetButton'
                                    )}
                                </Button>
                            </Popconfirm>
                        </Space>
                    </div>
                }
                open={open}
                onCancel={onCancel}
                footer={null}
                width={'85vw'}
                styles={{
                    body: {
                        maxHeight: '80vh',
                        overflowY: 'auto',
                    },
                }}
                centered
            >
                <Spin spinning={isLoading}>
                    <div className="mt-4 overflow-hidden rounded-lg border">
                        <AppTable<FtpReportFileDiscoveryRun>
                            columns={columns}
                            dataSource={discoveryRuns}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            scroll={{ x: 'max-content' }}
                        />
                    </div>
                </Spin>
            </Modal>

            {isRunModalOpen && (
                <RunFtpFileDiscoveryModal
                    open={isRunModalOpen}
                    onCancel={() => setIsRunModalOpen(false)}
                />
            )}
        </>
    );
};

export default FtpFileDiscoveryRunsModal;
