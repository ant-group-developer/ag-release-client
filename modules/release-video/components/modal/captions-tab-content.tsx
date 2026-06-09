import { RELEASE_VIDEO_CAPTION_TYPE } from '@/modules/release-video/enums';
import { useDeleteReleaseCaption } from '@/modules/releases/hooks/use-delete-release-caption';
import { useGetReleaseCaptions } from '@/modules/releases/hooks/use-get-release-captions';
import { ReleaseCaptionData } from '@/modules/releases/types';
import { Button, Modal, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Pencil, Trash2, Upload } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

const { Text } = Typography;

interface CaptionsTabContentProps {
    onUploadClick: () => void;
    onEditClick?: (record: ReleaseCaptionData) => void;
    disabled?: boolean;
}

export default function CaptionsTabContent({
    onUploadClick,
    onEditClick,
    disabled = false,
}: CaptionsTabContentProps) {
    const messages = useTranslations();
    const params = useParams<{ id: string }>();
    const { releaseCaptionsData, isLoading } = useGetReleaseCaptions(
        params?.id ?? '',
        RELEASE_VIDEO_CAPTION_TYPE.CAPTION
    );

    const { deleteReleaseCaption } = useDeleteReleaseCaption();

    const handleDelete = (id: string) => {
        if (disabled) return;
        Modal.confirm({
            title: messages('releaseVideo.captions.table.deleteCaptionTitle'),
            content: messages(
                'releaseVideo.captions.table.deleteCaptionContent'
            ),
            onOk: () => {
                return new Promise<void>((resolve, reject) => {
                    deleteReleaseCaption({
                        payload: id,
                        onSuccess: () => resolve(),
                        onError: () => reject(),
                    });
                });
            },
        });
    };

    const columns: ColumnsType<ReleaseCaptionData> = [
        {
            title: messages('releaseVideo.captions.table.language'),
            dataIndex: 'language',
            key: 'language',
            render: (_: any, record: ReleaseCaptionData) => (
                <span style={{ fontWeight: 600 }}>{record.language?.name}</span>
            ),
        },
        {
            title: messages('releaseVideo.captions.table.file'),
            dataIndex: 'file',
            key: 'file',
            render: (_: any, record: ReleaseCaptionData) => (
                <Space direction="vertical" size={0}>
                    <Text strong style={{ fontSize: 13 }}>
                        {record.file?.fileName}
                    </Text>
                </Space>
            ),
        },
        {
            title: messages('releaseVideo.captions.table.actions'),
            key: 'actions',
            align: 'center',
            render: (_: any, record: ReleaseCaptionData) => (
                <Space size={8}>
                    <Button
                        type="text"
                        icon={<Pencil size={18} />}
                        style={{ padding: 0 }}
                        disabled={disabled}
                        onClick={() => onEditClick?.(record)}
                    />
                    <Button
                        type="text"
                        icon={<Trash2 size={18} />}
                        style={{ padding: 0 }}
                        disabled={disabled}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
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
                    {messages('releaseVideo.captions.table.pendingCaption')}
                </Text>
                <Button
                    type="primary"
                    icon={<Upload size={16} />}
                    disabled={disabled}
                    onClick={onUploadClick}
                >
                    {messages('releaseVideo.captions.table.upload')}
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={releaseCaptionsData}
                loading={isLoading}
                rowKey="id"
                pagination={false}
                size="middle"
                locale={{
                    emptyText: messages(
                        'releaseVideo.captions.table.emptyCaptions'
                    ),
                }}
                scroll={{ y: 250 }}
            />
        </div>
    );
}
