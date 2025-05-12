import { showNotification } from '@/helpers/messages-helper';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { prioritiesApi } from '../apis';
import { priorityQueryKeys } from '../constants';
import { PriorityData } from '../types';

export interface DeletePriority extends CommonFunction {
    priorityId: PriorityData['id'];
}

export const useDeletePriority = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const onSuccess = (data: any, variables: DeletePriority) => {
        queryClient.invalidateQueries({ queryKey: priorityQueryKeys.getList });
        showNotification('success', messages(data.data.message));
        variables.onSuccess?.();
    };

    const onError = (data: any, variables: DeletePriority) => {
        showNotification('error', messages(data?.response?.data?.message));
        variables.onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ priorityId }: DeletePriority) =>
            prioritiesApi.deletePriority(priorityId),
        onSuccess,
        onError,
    });

    const deletePriority = (variables: DeletePriority) => {
        mutation.mutate(variables);
    };

    return { deletePriority, ...mutation };
};
