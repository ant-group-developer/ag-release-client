import { RELEASE_VIDEO_CAPTION_TYPE } from '@/modules/release-video/enums';
import { useGetReleaseCaptions } from '@/modules/releases/hooks/use-get-release-captions';
import { useDeleteReleaseCaption } from '@/modules/releases/hooks/use-delete-release-caption';
import { ReleaseCaptionData } from '@/modules/releases/types';
import { Button, Space, Table, Typography, Modal } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Trash2, Upload, Pencil } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

const { Text } = Typography;

interface CaptionsTabContentProps {
    onUploadClick: () => void;
    onEditClick?: (record: ReleaseCaptionData) => void;
}

export default function CaptionsTabContent({
    onUploadClick,
    onEditClick,
}: CaptionsTabContentProps) {
    const messages = useTranslations();
    const params = useParams<{ id: string }>();
    const { releaseCaptionsData, isLoading } = useGetReleaseCaptions(
        params?.id ?? '',
        RELEASE_VIDEO_CAPTION_TYPE.CAPTION
    );

    const { deleteReleaseCaption } = useDeleteReleaseCaption();

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: messages('releaseVideo.captions.table.deleteCaptionTitle'),
            content: messages('releaseVideo.captions.table.deleteCaptionContent'),
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
                        onClick={() => onEditClick?.(record)}
                    />
                    <Button
                        type="text"
                        icon={<Trash2 size={18} />}
                        style={{ padding: 0 }}
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
            />
        </div>
    );
}
