'use client';

import JsonViewer from '@/components/ui/json-viewer';
import AppTable, { AppTableProps } from '@/components/ui/table/normal-table';
import { formattedDate } from '@/helpers/common';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    CloudUploadOutlined,
    ExclamationCircleOutlined,
    FileExcelOutlined,
    InfoCircleOutlined,
    LoadingOutlined,
    RocketOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import {
    Alert,
    Badge,
    Card,
    Col,
    Flex,
    List,
    Row,
    Space,
    Tag,
    Tooltip,
    Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { BatchImportLogData } from '../types/data';
import { BatchImportStatus } from '../enums/batch-import-status.enum';

const { Text } = Typography;

const STATUS_CONFIG: Record<
    string,
    {
        color: string;
        icon: React.ReactNode;
        label: string;
    }
> = {
    [BatchImportStatus.VALIDATING]: {
        color: 'processing',
        icon: <SyncOutlined spin />,
        label: 'Validating',
    },
    [BatchImportStatus.VALIDATED]: {
        color: 'cyan',
        icon: <CheckCircleOutlined />,
        label: 'Validated',
    },
    [BatchImportStatus.VALIDATION_FAILED]: {
        color: 'error',
        icon: <CloseCircleOutlined />,
        label: 'Validation Failed',
    },
    [BatchImportStatus.UPLOADING]: {
        color: 'warning',
        icon: <LoadingOutlined />,
        label: 'Uploading',
    },
    [BatchImportStatus.UPLOADED]: {
        color: 'success',
        icon: <CheckCircleOutlined />,
        label: 'Uploaded',
    },
    [BatchImportStatus.CREATING]: {
        color: 'geekblue',
        icon: <RocketOutlined />,
        label: 'Creating',
    },
    [BatchImportStatus.COMPLETED]: {
        color: 'success',
        icon: <CheckCircleOutlined />,
        label: 'Completed',
    },
    [BatchImportStatus.FAILED]: {
        color: 'error',
        icon: <ExclamationCircleOutlined />,
        label: 'Failed',
    },
    [BatchImportStatus.SKIPPED]: {
        color: 'warning',
        icon: <ExclamationCircleOutlined />,
        label: 'Skipped',
    },
};

type Props = {
    pagination: {
        pageSize: number;
        current: number;
    };
} & Omit<AppTableProps<BatchImportLogData>, 'columns'>;

function BatchImportTable({ ...props }: Props) {
    const columns: ColumnsType<BatchImportLogData> = [
        {
            title: 'Tenant',
            dataIndex: 'tenantCode',
            width: 120,
            render: (value: string | null) =>
                value ? (
                    <Tag color="blue">{value}</Tag>
                ) : (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        —
                    </Text>
                ),
        },
        {
            title: 'Batch ID',
            dataIndex: 'batchId',
            width: 200,
            ellipsis: true,
            render: (value: string) => (
                <Text copyable={{ tooltips: false }}>{value}</Text>
            ),
        },
        {
            title: 'Release / UPC',
            dataIndex: 'releaseFolder',
            width: 160,
            render: (value: string) => (
                <Text copyable={{ tooltips: false }}>{value}</Text>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: 170,
            align: 'center',
            render: (status: string) => {
                const config = STATUS_CONFIG[status] || {
                    color: 'default',
                    icon: <ClockCircleOutlined />,
                    label: status,
                };
                return (
                    <Tag
                        icon={config.icon}
                        color={config.color}
                        style={{ padding: '2px 12px' }}
                    >
                        {config.label}
                    </Tag>
                );
            },
        },
        {
            title: (
                <Tooltip title="Files uploaded to storage">
                    <Space size={4}>
                        <CloudUploadOutlined />
                        <span>Files</span>
                    </Space>
                </Tooltip>
            ),
            dataIndex: 'storageKeys',
            width: 100,
            align: 'center',
            render: (keys: string[] | null) => {
                const count = keys?.length ?? 0;
                return (
                    <Badge
                        count={count}
                        showZero
                        color={count > 0 ? '#52c41a' : '#d9d9d9'}
                        overflowCount={999}
                    />
                );
            },
        },
        {
            title: 'Messages',
            dataIndex: 'errors',
            width: 90,
            align: 'center',
            render: (errors: string[] | null) => {
                const count = errors?.length ?? 0;
                if (count === 0) {
                    return (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            —
                        </Text>
                    );
                }
                const errorCount = errors!.filter(
                    (e) => !e.startsWith('[INFO]'),
                ).length;
                const infoCount = count - errorCount;
                return (
                    <Space size={4}>
                        {errorCount > 0 && (
                            <Badge
                                count={errorCount}
                                color="#ff4d4f"
                                overflowCount={99}
                            />
                        )}
                        {infoCount > 0 && (
                            <Badge
                                count={infoCount}
                                color="#1677ff"
                                overflowCount={99}
                            />
                        )}
                    </Space>
                );
            },
        },
        {
            title: 'Excel Rows',
            dataIndex: 'excelData',
            width: 100,
            align: 'center',
            render: (data: Record<string, unknown>[] | null) => {
                const count = data?.length ?? 0;
                return (
                    <Space size={4}>
                        <FileExcelOutlined
                            style={{ color: count > 0 ? '#52c41a' : '#d9d9d9' }}
                        />
                        <Text type={count > 0 ? undefined : 'secondary'}>
                            {count}
                        </Text>
                    </Space>
                );
            },
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            align: 'center',
            width: 170,
            render: (cell) => formattedDate(cell),
        },
    ];

    return (
        <AppTable
            {...props}
            pagination={false}
            columns={columns}
            expandable={{
                expandedRowRender: ({ excelData, storageKeys, errors }) => (
                    <div
                        style={{
                            padding: 16,
                            background: '#fafafa',
                            borderRadius: 8,
                        }}
                    >
                        <Row gutter={[16, 16]}>
                            {/* Excel Data Panel */}
                            {excelData && excelData.length > 0 && (
                                <Col xs={24} md={12} lg={8}>
                                    <Card
                                        size="small"
                                        title={
                                            <Flex align="center" gap={8}>
                                                <FileExcelOutlined
                                                    style={{
                                                        color: '#52c41a',
                                                        fontSize: 16,
                                                    }}
                                                />
                                                <span>Excel Data</span>
                                                <Badge
                                                    count={excelData.length}
                                                    color="#52c41a"
                                                    size="small"
                                                />
                                            </Flex>
                                        }
                                        styles={{
                                            body: {
                                                maxHeight: 300,
                                                overflow: 'auto',
                                            },
                                        }}
                                    >
                                        <JsonViewer
                                            src={excelData}
                                            style={{ maxHeight: 'unset' }}
                                        />
                                    </Card>
                                </Col>
                            )}

                            {/* Storage Files Panel */}
                            {storageKeys && storageKeys.length > 0 && (
                                <Col xs={24} md={12} lg={8}>
                                    <Card
                                        size="small"
                                        title={
                                            <Flex align="center" gap={8}>
                                                <CloudUploadOutlined
                                                    style={{
                                                        color: '#1677ff',
                                                        fontSize: 16,
                                                    }}
                                                />
                                                <span>Uploaded Files</span>
                                                <Badge
                                                    count={storageKeys.length}
                                                    color="#1677ff"
                                                    size="small"
                                                />
                                            </Flex>
                                        }
                                        styles={{
                                            body: {
                                                maxHeight: 300,
                                                overflow: 'auto',
                                            },
                                        }}
                                    >
                                        <List
                                            size="small"
                                            dataSource={storageKeys}
                                            renderItem={(key) => (
                                                <List.Item>
                                                    <Text
                                                        code
                                                        style={{
                                                            wordBreak:
                                                                'break-all',
                                                        }}
                                                        copyable={{
                                                            tooltips: false,
                                                        }}
                                                        ellipsis
                                                    >
                                                        {key}
                                                    </Text>
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                </Col>
                            )}

                            {/* Messages Panel */}
                            {errors && errors.length > 0 && (() => {
                                const infoMessages = errors.filter((e) =>
                                    e.startsWith('[INFO]'),
                                );
                                const errorMessages = errors.filter(
                                    (e) => !e.startsWith('[INFO]'),
                                );
                                return (
                                    <Col xs={24} md={12} lg={8}>
                                        <Card
                                            size="small"
                                            title={
                                                <Flex
                                                    align="center"
                                                    gap={8}
                                                >
                                                    <ExclamationCircleOutlined
                                                        style={{
                                                            color:
                                                                errorMessages.length >
                                                                0
                                                                    ? '#ff4d4f'
                                                                    : '#1677ff',
                                                            fontSize: 16,
                                                        }}
                                                    />
                                                    <Text strong>
                                                        Messages
                                                    </Text>
                                                    <Badge
                                                        count={errors.length}
                                                        color={
                                                            errorMessages.length >
                                                            0
                                                                ? '#ff4d4f'
                                                                : '#1677ff'
                                                        }
                                                        size="small"
                                                    />
                                                </Flex>
                                            }
                                            styles={{
                                                body: {
                                                    maxHeight: 300,
                                                    overflow: 'auto',
                                                },
                                            }}
                                        >
                                            <Flex vertical gap={8}>
                                                {infoMessages.map(
                                                    (msg, i) => (
                                                        <Alert
                                                            key={`info-${i}`}
                                                            type="info"
                                                            showIcon
                                                            icon={
                                                                <InfoCircleOutlined />
                                                            }
                                                            message={
                                                                msg.replace(
                                                                    /^\[INFO]\s*/,
                                                                    '',
                                                                )
                                                            }
                                                            style={{
                                                                fontSize: 12,
                                                            }}
                                                        />
                                                    ),
                                                )}
                                                {errorMessages.map(
                                                    (err, i) => (
                                                        <Alert
                                                            key={`err-${i}`}
                                                            type="error"
                                                            showIcon
                                                            icon={
                                                                <CloseCircleOutlined />
                                                            }
                                                            message={err}
                                                            style={{
                                                                fontSize: 12,
                                                            }}
                                                        />
                                                    ),
                                                )}
                                            </Flex>
                                        </Card>
                                    </Col>
                                );
                            })()}
                        </Row>
                    </div>
                ),
                rowExpandable: ({ excelData, storageKeys, errors }) =>
                    !!excelData ||
                    (!!storageKeys && storageKeys.length > 0) ||
                    (!!errors && errors.length > 0),
            }}
        />
    );
}

export default BatchImportTable;
