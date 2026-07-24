import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { Empty, Space, Table, Tag, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { CHANNEL_STATE } from '../../enums';
import { getChannelStateColor } from '../../helpers';
import { useGetChannels } from '../../hooks/use-get-channels';
import { DistributionChannel } from '../../types';

interface Props {
    distributionId?: string | null;
    /** ms auto refetch (mặc định tắt). */
    refetchInterval?: number;
}

/** Bảng trạng thái phát hành từng DSP (channel_delivery). */
export default function DistributionChannelsPanel({
    distributionId,
    refetchInterval,
}: Props) {
    const messages = useTranslations();
    const { channels, isFetching } = useGetChannels(
        distributionId ?? undefined,
        { refetchInterval }
    );

    if (!distributionId) {
        return <Empty description={messages('common.noDataAvailable')} />;
    }

    const columns = [
        {
            title: 'DSP',
            dataIndex: 'dspCode',
            key: 'dspCode',
            render: (_: unknown, r: DistributionChannel) => (
                <Space size={4}>
                    <span>{r.dspCode}</span>
                    {r.aggregatorCode && (
                        <Typography.Text type="secondary" className="text-xs">
                            ({r.aggregatorCode})
                        </Typography.Text>
                    )}
                </Space>
            ),
        },
        {
            title: messages('distributionOrchestration.channels.topology'),
            dataIndex: 'topology',
            key: 'topology',
            render: (v: string) => (
                <Tag bordered={false} className="font-normal">
                    {v}
                </Tag>
            ),
        },
        {
            title: messages('common.status'),
            dataIndex: 'state',
            key: 'state',
            render: (v: CHANNEL_STATE) => (
                <Tag
                    bordered={false}
                    color={getChannelStateColor(v)}
                    className="font-normal"
                >
                    {messages(`distributionOrchestration.channelState.${v}`)}
                </Tag>
            ),
        },
        {
            title: messages('distributionOrchestration.channels.scheduledAt'),
            dataIndex: 'scheduledAt',
            key: 'scheduledAt',
            render: (v: string | null, r: DistributionChannel) =>
                r.state === CHANNEL_STATE.WAITING && v
                    ? formattedDate(v, DATE_FORMAT.DATE_MINUTE)
                    : '—',
        },
    ];

    return (
        <div className="flex flex-col gap-2">
            <Typography.Text strong>
                {messages('distributionOrchestration.channels.title')}
            </Typography.Text>
            <Table<DistributionChannel>
                size="small"
                rowKey="channelId"
                loading={isFetching}
                dataSource={channels}
                columns={columns}
                pagination={false}
                locale={{
                    emptyText: (
                        <Empty
                            description={messages('common.noDataAvailable')}
                        />
                    ),
                }}
            />
        </div>
    );
}
