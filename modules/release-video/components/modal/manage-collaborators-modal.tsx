import AppModal from '@/components/ui/modal/normal-modal';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Space, Table, Typography } from 'antd';
import { useTranslations } from 'next-intl';

const { Text, Paragraph } = Typography;

interface ManageCollaboratorsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ManageCollaboratorsModal({
    isOpen,
    onClose,
}: ManageCollaboratorsModalProps) {
    const messages = useTranslations();

    // MOCK DATA for now, as no API exists
    const mockData = [
        {
            key: '1',
            vevoChannel: 'DreyBeatzVEVO',
            officialArtistChannel: '-',
            status: messages('status.active'),
        },
    ];

    const columns = [
        {
            title: messages('releaseVideo.collaborators.vevoChannel'),
            dataIndex: 'vevoChannel',
            key: 'vevoChannel',
            render: (text: string) => (
                <span className="font-semibold">{text}</span>
            ),
        },
        {
            title: messages('releaseVideo.collaborators.officialArtistChannel'),
            dataIndex: 'officialArtistChannel',
            key: 'officialArtistChannel',
        },
        {
            title: '',
            align: 'center' as const,
            render: () => (
                <Space size="middle">
                    <Button icon={<CopyOutlined />} shape="round">
                        {messages('releaseVideo.collaborators.copyInvite')}
                    </Button>
                </Space>
            ),
        },
        {
            title: '',
            key: 'action',
            align: 'center' as const,
            render: () => (
                <Space size="middle">
                    <Button type="text" icon={<DeleteOutlined />} danger />
                </Space>
            ),
        },
    ];

    return (
        <AppModal
            title={
                <Text strong style={{ fontSize: 18 }}>
                    {messages('releaseVideo.collaborators.title')}
                </Text>
            }
            open={isOpen}
            onCancel={onClose}
            onOk={onClose}
            okText={messages('common.submit')}
            cancelText={messages('common.cancel')}
            width={750}
        >
            <Flex vertical gap={20}>
                <Paragraph style={{ marginBottom: 0, fontSize: 14 }}>
                    {messages('releaseVideo.collaborators.description')}
                    <br />
                </Paragraph>

                {/* <Space size="small">
                    <a href="#" className="text-blue-500 hover:underline">
                        {messages(
                            'releaseVideo.collaborators.addVevoCollaborator'
                        )}
                    </a>
                    <span className="text-gray-400">|</span>
                    <a href="#" className="text-blue-500 hover:underline">
                        {messages('releaseVideo.collaborators.oacOnYouTube')}
                    </a>
                </Space> */}

                <Flex
                    vertical
                    gap={8}
                    style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16 }}
                >
                    <Text strong>
                        {messages('releaseVideo.collaborators.addVevoChannel')}
                    </Text>
                    <Flex gap={16}>
                        <Input
                            placeholder={messages(
                                'releaseVideo.collaborators.channelPlaceholder'
                            )}
                            style={{ flex: 1 }}
                        />
                        <Button>
                            {messages(
                                'releaseVideo.collaborators.addChannelButton'
                            )}
                        </Button>
                    </Flex>
                </Flex>

                <Table
                    dataSource={mockData}
                    columns={columns}
                    pagination={false}
                    size="middle"
                    style={{ width: '100%' }}
                />
            </Flex>
        </AppModal>
    );
}
