import { Button, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Trash2, Upload } from 'lucide-react';

const { Text } = Typography;

interface CaptionsTabContentProps {
    onUploadClick: () => void;
}

export default function CaptionsTabContent({
    onUploadClick,
}: CaptionsTabContentProps) {
    const columns: ColumnsType<any> = [
        {
            title: 'Language',
            dataIndex: 'language',
            key: 'language',
            render: (text: string) => (
                <span style={{ fontWeight: 600 }}>{text}</span>
            ),
        },
        {
            title: 'File',
            dataIndex: 'file',
            key: 'file',
            render: (_: any, record: any) => (
                <Space direction="vertical" size={0}>
                    <Text strong style={{ fontSize: 13 }}>
                        {record.fileName}
                    </Text>
                    <Text
                        style={{
                            color: '#d48806',
                            fontWeight: 600,
                            fontSize: 13,
                        }}
                    >
                        {record.status}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            render: () => (
                <Button
                    type="text"
                    icon={<Trash2 size={18} />}
                    style={{ padding: 0 }}
                />
            ),
        },
    ];

    const data = [
        {
            key: '1',
            language: 'Vietnamese (vi)',
            fileName: 'test_1780383094821.ttml',
            status: '(New pending publish)',
        },
    ];

    return (
        <div style={{ marginTop: 16 }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                }}
            >
                <Text strong style={{ fontSize: 14 }}>
                    Your new caption file is pending publish.
                </Text>
                <Button
                    type="primary"
                    icon={<Upload size={16} />}
                    onClick={onUploadClick}
                >
                    Upload
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                size="middle"
            />
        </div>
    );
}
