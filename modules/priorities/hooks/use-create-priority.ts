import { showNotification } from '@/helpers/messages-helper';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { prioritiesApi } from '../apis';
import { priorityQueryKeys } from '../constants';

export interface PriorityPayload {
    id?: string;
    nameVi?: string;
    nameEn?: string;
    color?: string;
    note?: string;
    order?: number;
}

export interface CreatePriority extends CommonFunction {
    payload: PriorityPayload;
}

export const useCreatePriority = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const onSuccess = (data: any, variables: CreatePriority) => {
        queryClient.invalidateQueries({ queryKey: priorityQueryKeys.getList });
        showNotification('success', messages(data.data.message));
        variables.onSuccess?.();
    };

    const onError = (data: any, variables: CreatePriority) => {
        showNotification('error', messages(data?.response?.data?.message));
        const errors = data?.response?.data?.errors;
        variables.onError?.(errors);
    };

    const mutation = useMutation({
        mutationFn: (variables: CreatePriority) => {
            return prioritiesApi.createPriority(variables.payload);
        },
        onSuccess,
        onError,
    });

    const createPriority = (variables: CreatePriority) => {
        mutation.mutate(variables);
    };

    return { createPriority, ...mutation };
};
