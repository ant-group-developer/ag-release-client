import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { USED_STATUS } from '../../enums';
import { useUpdateOrder } from '../../hooks/use-update-order';
import { UpdateOrder } from '../../types/update-order';

type Props = SelectProps & {
    orderId: string;
};

export default function UsedStatusSelect({ orderId, ...props }: Props) {
    const { updateOrder, isPending: isPendingUpdate } = useUpdateOrder();

    const handleUpdateUsedStatus = (value: USED_STATUS, orderId: string) => {
        const variables: UpdateOrder = {
            payload: {
                dataOrder: {
                    id: orderId,
                    usedStatus: value ?? null,
                },
            },
            onSuccess: () => {},
        };
        updateOrder(variables);
    };

    const messages = useTranslations();
    const options = [
        {
            label: messages('common.used'),
            value: USED_STATUS.USED,
        },
        {
            label: messages('common.notUsed'),
            value: USED_STATUS.NOT_USED,
        },
    ];
    return (
        <Select
            {...props}
            options={options}
            placeholder={messages('common.status')}
            className="w-full"
            disabled={isPendingUpdate}
            onChange={(value) => {
                handleUpdateUsedStatus(value, orderId);
            }}
        />
    );
}
