import UserSelect from '@/modules/user/components/user-select';
import { Key } from 'react';
import { useAssignUser } from '../../hooks/use-assignee';
import { useRemoveAssignee } from '../../hooks/use-remove-assignee';
import { UserAssignPayload } from '../../types';

type Props = {
    selectedRowKeys?: Key[];
    value?: string;
    className?: string;
    fallback?: string;
    disabled?: boolean;
    allowClear?: boolean;
};

export default function QuickAssigneeSelect({
    selectedRowKeys,
    value,
    className,
    disabled,
    allowClear,
    fallback,
}: Props) {
    const { assignUser, isPending } = useAssignUser();
    const { removeAssignee } = useRemoveAssignee();

    const handleAssignee = (value: string) => {
        const variables: UserAssignPayload = {
            payload: {
                assigneeId: value,
                listOrderProductId: selectedRowKeys || [],
            },
            onSuccess: () => {},
        };
        assignUser(variables);
    };

    const handleRemoveAssignee = () => {
        const variables = {
            payload: {
                orderProductIds: selectedRowKeys || [],
            },
            onSuccess: () => {},
        };
        removeAssignee(variables);
    };

    return (
        <UserSelect
            onSelect={handleAssignee}
            value={value}
            fallback={fallback}
            allowClear={allowClear}
            onClear={handleRemoveAssignee}
            disabled={disabled || isPending}
        />
    );
}
