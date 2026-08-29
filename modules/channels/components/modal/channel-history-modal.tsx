import CopyText from '@/components/ui/copy-text/copy-text';
import AppModal from '@/components/ui/modal/normal-modal';
import { formattedDate } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { Table } from 'antd';
import { useTranslations } from 'next-intl';
import { ChannelHistoryData, ChannelsData } from '../../types';
import ChannelThumbImage from '../image/channel-thumb-image';
import ChannelStatusTag from '../tag/channel-status-tag';

export default function ChannelHistoryModal() {
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const channel = useModalStore<ChannelsData>((state) => state.dataEdit);
    const histories = channel?.histories ?? [];

    return (
        <AppModal
            open
            title={`${messages('common.history')} - ${channel?.name ?? ''}`}
            width={'80VW'}
            footer={null}
            onCancel={closeModal}
        >
            <Table<ChannelHistoryData>
                rowKey={(record) => record.id}
                dataSource={histories}
                pagination={false}
                size="small"
                scroll={{ y: 520 }}
                columns={[
                    {
                        title: messages('common.thumbnail'),
                        dataIndex: ['channel', 'thumbUrl'],
                        key: 'thumbUrl',
                        width: 90,
                        align: 'center',
                        render: (_, record) => (
                            <ChannelThumbImage
                                thumbUrl={record.channel?.thumbUrl}
                                name={
                                    record.channel?.name ?? channel?.name ?? ''
                                }
                            />
                        ),
                    },
                    {
                        title: messages('channel.name'),
                        dataIndex: ['channel', 'name'],
                        key: 'name',
                        width: 220,
                        render: (value) => value || '-',
                    },
                    {
                        title: messages('tenant.label'),
                        dataIndex: ['channel', 'tenant', 'name'],
                        key: 'tenant',
                        width: 180,
                        render: (value) => value || '-',
                    },
                    {
                        title: messages('channel.transfer.effectiveDate'),
                        dataIndex: 'effectiveDate',
                        key: 'effectiveDate',
                        width: 140,
                        render: (value) => value || '-',
                    },
                    {
                        title: messages('channel.transfer.revenueEffectiveFrom'),
                        dataIndex: 'revenueEffectiveFrom',
                        key: 'revenueEffectiveFrom',
                        width: 140,
                        render: (value) => value || '-',
                    },
                    {
                        title: 'YouTube channel ID',
                        dataIndex: ['channel', 'youtubeChannelId'],
                        key: 'youtubeChannelId',
                        width: 220,
                        render: (value) =>
                            value ? (
                                <CopyText text={value}>
                                    <span>{value}</span>
                                </CopyText>
                            ) : (
                                '-'
                            ),
                    },
                    {
                        title: messages('common.status'),
                        dataIndex: ['channel', 'status'],
                        key: 'status',
                        width: 130,
                        align: 'center',
                        render: (value) => <ChannelStatusTag status={value} />,
                    },
                    {
                        title: messages('common.error'),
                        dataIndex: ['channel', 'error'],
                        key: 'error',
                        ellipsis: true,
                        width: 240,
                        render: (value) => value || '-',
                    },
                    {
                        title: messages('common.createdAt'),
                        dataIndex: 'createdAt',
                        key: 'createdAt',
                        width: 160,
                        align: 'center',
                        render: (value) => (value ? formattedDate(value) : '-'),
                    },
                ]}
            />
        </AppModal>
    );
}
