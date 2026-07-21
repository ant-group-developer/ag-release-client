import AppModal from '@/components/ui/modal/normal-modal';
import {
    convertSecondsToHHMMSS,
    formatFileSize,
    formattedDate,
    formattedNumber,
} from '@/helpers/common';
import {
    Button,
    Collapse,
    Empty,
    Spin,
    Table,
    Tabs,
    Tag,
    Tooltip,
    Typography,
} from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useGetEtlJobStatusDetail } from '../../hooks/use-get-etl-job-status-detail';

interface EtlJobStatusDetailModalProps {
    open: boolean;
    onClose: () => void;
    jobId: string | null;
}

export const EtlJobStatusDetailModal: React.FC<
    EtlJobStatusDetailModalProps
> = ({ open, onClose, jobId }) => {
    const messages = useTranslations();
    const { statusDetail, isLoading } = useGetEtlJobStatusDetail(
        jobId as string,
        {
            enabled: open && !!jobId,
        }
    );

    const getStatusTagColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'done':
                return 'success';
            case 'failed':
                return 'error';
            case 'processing':
                return 'processing';
            case 'pending':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'done':
                return (
                    messages('reportConfigs.importResult.statusCompleted') ||
                    'Thành công'
                );
            case 'failed':
                return (
                    messages('reportConfigs.importResult.statusFailed') ||
                    'Thất bại'
                );
            case 'processing':
                return (
                    messages('reportConfigs.importResult.statusProcessing') ||
                    'Đang xử lý'
                );
            case 'pending':
                return (
                    messages('reportConfigs.importResult.statusPending') ||
                    'Đang chờ'
                );
            default:
                return status;
        }
    };

    const columns = [
        {
            title: messages('common.fileName') || 'Tên tệp',
            dataIndex: 'fileName',
            key: 'fileName',
            width: 250,
            ellipsis: true,
            render: (value: string) => (
                <Tooltip title={value}>
                    <Typography.Text
                        copyable
                        ellipsis
                        style={{ maxWidth: 240 }}
                    >
                        {value}
                    </Typography.Text>
                </Tooltip>
            ),
        },
        {
            title: messages('common.status') || 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            align: 'center' as const,
            render: (status: string) => (
                <Tag color={getStatusTagColor(status)}>
                    {getStatusLabel(status)}
                </Tag>
            ),
        },
        {
            title:
                messages('common.fileSize' as any) ||
                messages('video.fileSize' as any) ||
                'Dung lượng',
            dataIndex: 'fileSizeBytes',
            key: 'fileSizeBytes',
            width: 120,
            align: 'right' as const,
            render: (value: number) =>
                value !== undefined && value !== null
                    ? formatFileSize(value)
                    : '-',
        },
        {
            title:
                messages('reportConfigs.importResult.totalRows') ||
                'Tổng số dòng',
            dataIndex: 'totalLines',
            key: 'totalLines',
            width: 120,
            align: 'right' as const,
            render: (value: number) =>
                value !== undefined && value !== null
                    ? formattedNumber(value)
                    : '-',
        },
        {
            title:
                messages('reportConfigs.importResult.processedRows') ||
                'Đã xử lý',
            dataIndex: 'processedRows',
            key: 'processedRows',
            width: 120,
            align: 'right' as const,
            render: (value: number) =>
                value !== undefined && value !== null
                    ? formattedNumber(value)
                    : '-',
        },
        {
            title:
                messages('reportConfigs.importResult.skippedRows') || 'Bỏ qua',
            dataIndex: 'skippedRows',
            key: 'skippedRows',
            width: 100,
            align: 'right' as const,
            render: (value: number) =>
                value !== undefined && value !== null
                    ? formattedNumber(value)
                    : '-',
        },
        {
            title: messages('reportConfigs.importResult.errorRows') || 'Lỗi',
            dataIndex: 'errorRows',
            key: 'errorRows',
            width: 100,
            align: 'right' as const,
            render: (value: number) =>
                value !== undefined && value !== null
                    ? formattedNumber(value)
                    : '-',
        },
        {
            title:
                messages('reportConfigs.importResult.duration') ||
                'Thời gian chạy',
            dataIndex: 'durationMs',
            key: 'durationMs',
            width: 120,
            align: 'left' as const,
            render: (value: number) =>
                value !== undefined && value !== null
                    ? convertSecondsToHHMMSS(value / 1000)
                    : '-',
        },
        {
            title:
                messages('reportConfigs.importResult.startTime') || 'Bắt đầu',
            dataIndex: 'startedAt',
            key: 'startedAt',
            width: 160,
            align: 'center' as const,
            render: (value: string) => (value ? formattedDate(value) : '-'),
        },
        {
            title: messages('common.completedAt') || 'Hoàn thành',
            dataIndex: 'completedAt',
            key: 'completedAt',
            width: 160,
            align: 'center' as const,
            render: (value: string) => (value ? formattedDate(value) : '-'),
        },
        {
            title:
                messages('reportConfigs.importResult.errorDetails') ||
                'Thông báo lỗi',
            dataIndex: 'errorMessage',
            key: 'errorMessage',
            width: 200,
            ellipsis: true,
            render: (value: string) =>
                value ? (
                    <Tooltip title={value}>
                        <Typography.Text
                            type="danger"
                            ellipsis
                            style={{ maxWidth: 180 }}
                        >
                            {value}
                        </Typography.Text>
                    </Tooltip>
                ) : (
                    '-'
                ),
        },
    ];

    const renderContent = () => {
        if (isLoading) {
            return (
                <div
                    style={{
                        display: 'flex',
                        height: 240,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Spin size="large" />
                </div>
            );
        }

        if (!statusDetail || Object.keys(statusDetail).length === 0) {
            return (
                <div style={{ padding: '40px 0' }}>
                    <Empty
                        description={
                            messages('common.noData' as any) ||
                            'Không có dữ liệu'
                        }
                    />
                </div>
            );
        }

        const periods = Object.keys(statusDetail).sort((a, b) =>
            b.localeCompare(a)
        );

        const tabItems = periods.map((period) => {
            const formattedPeriod =
                period.length === 6
                    ? `${period.substring(0, 4)}-${period.substring(4)}`
                    : period;

            const types = Object.keys(statusDetail[period]);

            const collapseItems = types.map((type) => {
                const partners = statusDetail[period][type];
                const partnerCodes = Object.keys(partners);

                return {
                    key: type,
                    label: (
                        <Typography.Text
                            strong
                            style={{ textTransform: 'capitalize' }}
                        >
                            {type === 'sales'
                                ? messages(
                                      'reportConfigs.reportTypeSales' as any
                                  ) || 'Doanh thu (Sales)'
                                : type === 'trends'
                                  ? messages(
                                        'reportConfigs.reportTypeTrends' as any
                                    ) || 'Xu hướng (Trends)'
                                  : type}
                        </Typography.Text>
                    ),
                    children: (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 24,
                            }}
                        >
                            {partnerCodes.map((partnerCode) => {
                                const files = partners[partnerCode];
                                return (
                                    <div key={partnerCode}>
                                        <div style={{ marginBottom: 12 }}>
                                            <Typography.Title
                                                level={5}
                                                style={{ margin: 0 }}
                                            >
                                                {messages(
                                                    'reportConfigs.partner' as any
                                                ) || 'Đối tác'}
                                                :{' '}
                                                <span
                                                    style={{
                                                        textTransform:
                                                            'uppercase',
                                                    }}
                                                >
                                                    {partnerCode}
                                                </span>
                                            </Typography.Title>
                                        </div>
                                        <Table
                                            dataSource={files}
                                            columns={columns}
                                            rowKey="fileName"
                                            pagination={false}
                                            size="small"
                                            scroll={{ x: 'max-content' }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ),
                };
            });

            return {
                key: period,
                label: formattedPeriod,
                children: (
                    <Collapse
                        defaultActiveKey={types}
                        items={collapseItems}
                        style={{ marginTop: 12 }}
                    />
                ),
            };
        });

        return (
            <Tabs
                defaultActiveKey={periods[0]}
                items={tabItems}
                type="card"
                style={{ minHeight: 300 }}
            />
        );
    };

    return (
        <AppModal
            centered
            title={
                <Typography.Title level={5}>
                    {messages(
                        'reportConfigs.importResult.statusDetailModalTitle'
                    )}
                </Typography.Title>
            }
            open={open}
            onCancel={onClose}
            width={1100}
            footer={[
                <Button key="close" onClick={onClose}>
                    {messages('common.close') || 'Đóng'}
                </Button>,
            ]}
            destroyOnClose
        >
            <div style={{ padding: '12px 0' }}>{renderContent()}</div>
        </AppModal>
    );
};
