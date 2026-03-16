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
    LoadingOutlined,
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
import copy from 'copy-to-clipboard';
import { BatchImportLogData } from '../types/data';

const { Text } = Typography;

const STATUS_CONFIG: Record<
    string,
    {
        color: string;
        icon: React.ReactNode;
        label: string;
    }
> = {
    validating: {
        color: 'processing',
        icon: <SyncOutlined spin />,
        label: 'Validating',
    },
    validated: {
        color: 'cyan',
        icon: <CheckCircleOutlined />,
        label: 'Validated',
    },
    validation_failed: {
        color: 'error',
        icon: <CloseCircleOutlined />,
        label: 'Validation Failed',
    },
    uploading: {
        color: 'warning',
        icon: <LoadingOutlined />,
        label: 'Uploading',
    },
    uploaded: {
        color: 'success',
        icon: <CheckCircleOutlined />,
        label: 'Uploaded',
    },
    failed: {
        color: 'error',
        icon: <ExclamationCircleOutlined />,
        label: 'Failed',
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
            title: 'Batch ID',
            dataIndex: 'batchId',
            width: 200,
            ellipsis: true,
            render: (value: string) => (
                <Text
                    style={{
                        fontFamily: 'monospace',
                        fontSize: 12,
                        cursor: 'pointer',
                    }}
                    copyable={{ tooltips: false }}
                >
                    {value}
                </Text>
            ),
        },
        {
            title: 'Release / UPC',
            dataIndex: 'releaseFolder',
            width: 160,
            render: (value: string) => (
                <Text copyable={{ tooltips: false }} style={{ fontSize: 13 }}>
                    {value}
                </Text>
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
            title: 'Errors',
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
                return (
                    <Badge count={count} color="#ff4d4f" overflowCount={99} />
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
                                                <List.Item
                                                    style={{
                                                        padding: '4px 0',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => copy(key)}
                                                >
                                                    <Tooltip title="Click to copy">
                                                        <Text
                                                            code
                                                            style={{
                                                                fontSize: 11,
                                                                wordBreak:
                                                                    'break-all',
                                                            }}
                                                        >
                                                            {key}
                                                        </Text>
                                                    </Tooltip>
                                                </List.Item>
                                            )}
                                        />
                                    </Card>
                                </Col>
                            )}

                            {/* Errors Panel */}
                            {errors && errors.length > 0 && (
                                <Col xs={24} md={12} lg={8}>
                                    <Card
                                        size="small"
                                        title={
                                            <Flex align="center" gap={8}>
                                                <ExclamationCircleOutlined
                                                    style={{
                                                        color: '#ff4d4f',
                                                        fontSize: 16,
                                                    }}
                                                />
                                                <Text
                                                    strong
                                                    style={{ color: '#ff4d4f' }}
                                                >
                                                    Errors
                                                </Text>
                                                <Badge
                                                    count={errors.length}
                                                    color="#ff4d4f"
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
                                            {errors.map((err, i) => (
                                                <Alert
                                                    key={i}
                                                    type="error"
                                                    showIcon
                                                    icon={
                                                        <CloseCircleOutlined />
                                                    }
                                                    message={err}
                                                    style={{ fontSize: 12 }}
                                                />
                                            ))}
                                        </Flex>
                                    </Card>
                                </Col>
                            )}
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
