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

export default function QuickApproverSelect({
    selectedRowKeys,
    value,
    className,
    disabled,
    fallback,
}: Props) {
    const { assignUser, isPending } = useAssignUser();
    const { removeAssignee } = useRemoveAssignee();

    const handleAssignee = (value: string) => {
        const variables: UserAssignPayload = {
            payload: {
                approverId: value,
                listOrderProductId: selectedRowKeys || [],
            },
            onSuccess: () => {},
        };
        assignUser(variables);
    };

    // const handleRemoveAssignee = () => {
    //     const variables = {
    //         payload: {
    //             orderProductIds: selectedRowKeys || [],
    //         },
    //         onSuccess: () => {},
    //     };
    //     removeAssignee(variables);
    // };

    return (
        <UserSelect
            onSelect={handleAssignee}
            value={value}
            fallback={fallback}
            // onClear={handleRemoveAssignee}
            disabled={disabled || isPending}
        />
    );
}
