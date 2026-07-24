import { usePermission } from '@/hooks/use-permission';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { Button, Card, Empty, List, Space, Tag, Typography } from 'antd';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useGetTickets } from '../../hooks/use-get-tickets';
import { useResolveTicket } from '../../hooks/use-resolve-ticket';
import { DistributionTicket, TicketIssueItem } from '../../types';
import AddFlagModal from './add-flag-modal';

interface Props {
    distributionId?: string | null;
    /** Cho phép reviewer tạo flag (reject với items). */
    canReview?: boolean;
}

const severityColor = (s: TicketIssueItem['severity']) =>
    s === 'error' ? 'red' : 'orange';

/**
 * Panel flag lỗi: liệt kê mọi ticket (reviewer + CI/QA/Spotify) render items[] chuẩn hoá.
 * User bấm "Đã sửa" để resolve ticket; reviewer có nút tạo flag mới.
 */
export default function DistributionFlagsPanel({
    distributionId,
    canReview,
}: Props) {
    const messages = useTranslations();
    const { hasPermission } = usePermission();
    const canResolve =
        hasPermission(PERMISSION.RELEASE_AUDIO.UPDATE) ||
        hasPermission(PERMISSION.RELEASE_VIDEO.UPDATE);

    const [addOpen, setAddOpen] = useState(false);
    const { tickets, isFetching } = useGetTickets(distributionId ?? undefined);
    const { resolveTicket, isPending } = useResolveTicket();

    if (!distributionId) {
        return <Empty description={messages('common.noDataAvailable')} />;
    }

    const renderTicket = (ticket: DistributionTicket) => (
        <Card
            size="small"
            className="mb-2"
            title={
                <Space wrap>
                    <Typography.Text strong>{ticket.reason}</Typography.Text>
                    <Tag
                        bordered={false}
                        color={ticket.status === 'open' ? 'processing' : 'success'}
                    >
                        {ticket.status}
                    </Tag>
                </Space>
            }
            extra={
                canResolve &&
                ticket.status === 'open' && (
                    <Button
                        size="small"
                        icon={<Check size={14} />}
                        loading={isPending}
                        onClick={() =>
                            resolveTicket({
                                id: distributionId,
                                ticketId: ticket.id,
                            })
                        }
                    >
                        {messages('distributionOrchestration.flags.markFixed')}
                    </Button>
                )
            }
        >
            {ticket.detail && (
                <Typography.Paragraph type="secondary" className="!mb-2 text-xs">
                    {ticket.detail}
                </Typography.Paragraph>
            )}
            {ticket.items.length > 0 ? (
                <List
                    size="small"
                    dataSource={ticket.items}
                    renderItem={(item) => (
                        <List.Item>
                            <Space direction="vertical" size={2} className="w-full">
                                <Space wrap>
                                    <Tag
                                        bordered={false}
                                        color={severityColor(item.severity)}
                                    >
                                        {item.code}
                                    </Tag>
                                    <span>{item.message}</span>
                                    {item.location && (
                                        <Typography.Text
                                            type="secondary"
                                            className="text-xs"
                                        >
                                            @ {item.location}
                                        </Typography.Text>
                                    )}
                                </Space>
                                {item.suggestion && (
                                    <Typography.Text
                                        type="secondary"
                                        className="text-xs"
                                    >
                                        💡 {item.suggestion}
                                    </Typography.Text>
                                )}
                            </Space>
                        </List.Item>
                    )}
                />
            ) : null}
        </Card>
    );

    return (
        <div className="flex flex-col gap-3">
            <Space className="justify-between">
                <Typography.Text strong>
                    {messages('distributionOrchestration.flags.title')}
                </Typography.Text>
                {canReview && (
                    <Button type="primary" onClick={() => setAddOpen(true)}>
                        {messages('distributionOrchestration.flags.addFlag')}
                    </Button>
                )}
            </Space>

            {tickets.length === 0 && !isFetching ? (
                <Empty
                    description={messages(
                        'distributionOrchestration.flags.empty'
                    )}
                />
            ) : (
                tickets.map((t) => (
                    <div key={t.id}>{renderTicket(t)}</div>
                ))
            )}

            <AddFlagModal
                open={addOpen}
                distributionId={distributionId}
                onClose={() => setAddOpen(false)}
            />
        </div>
    );
}
