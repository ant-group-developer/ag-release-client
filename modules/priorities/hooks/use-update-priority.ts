import { showNotification } from '@/helpers/messages-helper';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { prioritiesApi } from '../apis';
import { priorityQueryKeys } from '../constants';
import { PriorityData } from '../types';
import { PriorityPayload } from './use-create-priority';

export interface UpdatePriority extends CommonFunction {
    priorityId: PriorityData['id'];
    payload: PriorityPayload;
}

export const useUpdatePriority = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const onSuccess = (data: any, variables: UpdatePriority) => {
        queryClient.invalidateQueries({ queryKey: priorityQueryKeys.getList });
        showNotification('success', messages(data.data.message));
        variables.onSuccess?.();
    };

    const onError = (data: any, variables: UpdatePriority) => {
        showNotification('error', messages(data?.response?.data?.message));
        const errors = data?.response?.data?.errors;
        variables.onError?.(errors);
    };

    const mutation = useMutation({
        mutationFn: ({ priorityId, payload }: UpdatePriority) =>
            prioritiesApi.updatePriority(priorityId, payload),
        onSuccess,
        onError,
    });

    const updatePriority = (variables: UpdatePriority) => {
        mutation.mutate(variables);
    };

    return { updatePriority, ...mutation };
};
