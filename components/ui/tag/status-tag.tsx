import { ORDER_STATUS } from '@/modules/order/enums';
import { Tag, TagProps } from 'antd';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

type Props = TagProps & {
    value: ORDER_STATUS;
    affix?: ReactNode;
};

export default function StatusTag({
    value,
    bordered = false,
    affix,
    ...props
}: Props) {
    const statusMap = new Map<
        ORDER_STATUS,
        {
            labelKey:
                | 'order.status.reject'
                | 'order.status.completed'
                | 'order.status.inProgress'
                | 'order.status.pendingApproval'
                | 'common.cancel'
                | 'order.status.new'
                | 'order.status.deadline'
                | 'order.status.pendingLeaderApproval'
                | 'order.status.leaderReject';
            color: string;
        }
    >([
        [
            ORDER_STATUS.REJECT,
            { labelKey: 'order.status.reject', color: 'error' },
        ],
        [
            ORDER_STATUS.COMPLETED,
            { labelKey: 'order.status.completed', color: 'success' },
        ],
        [
            ORDER_STATUS.IN_PROGRESS,
            { labelKey: 'order.status.inProgress', color: 'warning' },
        ],
        [
            ORDER_STATUS.PENDING_APPROVAL,
            { labelKey: 'order.status.pendingApproval', color: 'purple' },
        ],
        [ORDER_STATUS.CANCEL, { labelKey: 'common.cancel', color: 'red' }],
        [
            ORDER_STATUS.NEW,
            { labelKey: 'order.status.new', color: 'processing' },
        ],
        [
            ORDER_STATUS.OVERDUE,
            { labelKey: 'order.status.deadline', color: 'volcano' },
        ],
        [
            ORDER_STATUS.PENDING_LEADER_APPROVAL,
            {
                labelKey: 'order.status.pendingLeaderApproval',
                color: 'magenta',
            },
        ],
        [
            ORDER_STATUS.LEADER_REJECT,
            { labelKey: 'order.status.leaderReject', color: 'red' },
        ],
    ]);
    const messages = useTranslations();
    const status = statusMap.get(value);

    if (!status) {
        return null;
    }

    return (
        <>
            <Tag {...props} color={status.color} bordered={bordered}>
                {messages(status.labelKey)} {affix && `(${affix})`}
            </Tag>
        </>
    );
}
