import {
    CheckCircleFilled,
    CustomerServiceOutlined,
    DeleteOutlined,
    FieldTimeOutlined,
    LoadingOutlined,
    PictureOutlined,
    TagOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    Button,
    Card,
    Collapse,
    Descriptions,
    Flex,
    Image,
    Space,
    Tag,
    Typography,
} from 'antd';
import React from 'react';
import type { DraftRelease } from '../types';
import TracksTable from './tracks-table';

const { Text } = Typography;

interface ReleaseCardProps {
    release: DraftRelease;
    onRemove: (id: string) => void;
}

const ReleaseCard: React.FC<ReleaseCardProps> = React.memo(
    ({ release, onRemove }) => {
        const isDone = release.jobStatus === 'done';

        const extra = isDone ? (
            <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => onRemove(release.id)}
            >
                Xoá
            </Button>
        ) : (
            <Tag
                color={
                    release.jobStatus === 'uploading'
                        ? 'processing'
                        : release.jobStatus === 'processing'
                          ? 'warning'
                          : 'default'
                }
            >
                {release.jobStatus === 'pending' ? (
                    'Đang chờ'
                ) : (
                    <>
                        <LoadingOutlined style={{ marginRight: 4 }} />
                        {release.jobStatus === 'uploading'
                            ? 'Đang upload'
                            : 'Đang xử lý'}
                    </>
                )}
            </Tag>
        );

        const cardTitle = (
            <Space>
                {isDone ? (
                    <CheckCircleFilled style={{ color: '#52c41a' }} />
                ) : release.jobStatus !== 'pending' ? (
                    <LoadingOutlined style={{ color: '#1677ff' }} />
                ) : null}
                <Text strong>{release.title}</Text>
            </Space>
        );

        return (
            <Card title={cardTitle} extra={extra} size="small">
                <Flex gap={20} wrap="wrap">
                    {/* Cover */}
                    <div
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 8,
                            overflow: 'hidden',
                            flexShrink: 0,
                            background: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {release.coverUrl ? (
                            <Image
                                src={release.coverUrl}
                                alt="Cover"
                                width={80}
                                height={80}
                                style={{ objectFit: 'cover' }}
                                preview={{ mask: 'Preview' }}
                            />
                        ) : (
                            <PictureOutlined
                                style={{ fontSize: 36, color: '#bfbfbf' }}
                            />
                        )}
                    </div>

                    {/* Info */}
                    <Flex vertical gap={8} style={{ flex: 1, minWidth: 0 }}>
                        <Descriptions
                            size="small"
                            column={{ xs: 1, sm: 2, md: 4 }}
                        >
                            <Descriptions.Item
                                label={
                                    <Space size={4}>
                                        <UserOutlined />
                                        Artist
                                    </Space>
                                }
                            >
                                {release.artist}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={
                                    <Space size={4}>
                                        <TagOutlined />
                                        Label
                                    </Space>
                                }
                            >
                                {release.label}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={
                                    <Space size={4}>
                                        <FieldTimeOutlined />
                                        Date
                                    </Space>
                                }
                            >
                                {release.releaseDate}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={
                                    <Space size={4}>
                                        <CustomerServiceOutlined />
                                        Tracks
                                    </Space>
                                }
                            >
                                {release.totalTracks}
                            </Descriptions.Item>
                        </Descriptions>
                    </Flex>
                </Flex>

                {/* Tracks table — collapsible */}
                <Collapse
                    ghost
                    size="small"
                    style={{ marginTop: 12 }}
                    items={[
                        {
                            key: 'tracks',
                            label: (
                                <Text type="secondary">
                                    Tracks ({release.totalTracks})
                                </Text>
                            ),
                            children: <TracksTable tracks={release.tracks} />,
                        },
                    ]}
                />
            </Card>
        );
    }
);

ReleaseCard.displayName = 'ReleaseCard';

export default ReleaseCard;
