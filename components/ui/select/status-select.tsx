import AppSelect from '@/components/ui/select/nomal-select';
import { SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { ORDER_STATUS } from '../../../modules/order/enums';

interface StatusSelectProps extends SelectProps {}

export default function StatusSelect({ ...props }: StatusSelectProps) {
    const messages = useTranslations();
    const statusOptions = [
        {
            value: ORDER_STATUS.COMPLETED,
            label: messages('order.status.completed'),
        },
        {
            value: ORDER_STATUS.IN_PROGRESS,
            label: messages('order.status.inProgress'),
        },
        {
            value: ORDER_STATUS.REJECT,
            label: messages('order.status.reject'),
        },
        {
            value: ORDER_STATUS.NEW,
            label: messages('order.status.new'),
        },
        {
            value: ORDER_STATUS.PENDING_APPROVAL,
            label: messages('order.status.pendingApproval'),
        },
        {
            value: ORDER_STATUS.OVERDUE,
            label: messages('order.status.deadline'),
        },
    ];
    return <AppSelect {...props} options={statusOptions} />;
}
