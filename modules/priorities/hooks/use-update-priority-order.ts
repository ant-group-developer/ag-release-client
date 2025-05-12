import { showNotification } from '@/helpers/messages-helper';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { prioritiesApi } from '../apis';
import { priorityQueryKeys } from '../constants';

export interface UpdatePriorityOrderPayload {
    data: Array<{ id: string; order: number }>;
}

export interface UpdatePriorityOrder extends CommonFunction {
    payload: UpdatePriorityOrderPayload;
}

export const useUpdatePriorityOrder = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const handleSuccess = (data: any, { onSuccess }: UpdatePriorityOrder) => {
        queryClient.invalidateQueries({ queryKey: priorityQueryKeys.getList });
        showNotification(
            'success',
            messages(data?.data?.message) ||
                messages('message.updateSuccessfully')
        );
        onSuccess?.();
    };

    const handleOnErrors = (data: any) => {
        showNotification('error', messages(data?.response?.data?.message));
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: UpdatePriorityOrder) =>
            prioritiesApi.updatePriorityOrder(payload),
        onSuccess: handleSuccess,
        onError: handleOnErrors,
    });

    const updatePriorityOrder = (variables: UpdatePriorityOrder) => {
        mutation.mutate(variables);
    };

    return { updatePriorityOrder, ...mutation };
};
