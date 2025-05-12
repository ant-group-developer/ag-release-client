import { showNotification } from '@/helpers/messages-helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { topicApi } from '../apis';
import { topicQueryKeys } from '../constants';
import { CreateTopic, CreateTopicWithConfig } from '../types/create-topic';

export const useCreateTopic = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const onSuccess = (data: any, { onSuccess, onError }: CreateTopic) => {
        queryClient.invalidateQueries({ queryKey: topicQueryKeys.getList });
        showNotification('success', messages(data.data.message));
        onSuccess?.();
    };

    const onError = (data: any, { onSuccess, onError }: CreateTopic) => {
        showNotification('error', messages(data?.response.data.message));
        const errors = data.response.data.errors;
        onError?.(errors);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateTopic) => topicApi.createTopic(payload),
        onSuccess,
        onError,
    });

    const createTopic = (variables: CreateTopic) => {
        mutation.mutate(variables);
    };

    return { createTopic, ...mutation };
};

export const useCreateTopicWithConfig = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const onSuccess = (
        data: any,
        { onSuccess, onError }: CreateTopicWithConfig
    ) => {
        queryClient.invalidateQueries({ queryKey: topicQueryKeys.getList });
        showNotification('success', messages(data.data.message));
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onSuccess, onError }: CreateTopicWithConfig
    ) => {
        showNotification('error', messages(data?.response.data.message));
        const errors = data.response.data.errors;
        onError?.(errors);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateTopicWithConfig) =>
            topicApi.createTopicWithConfig(payload),
        onSuccess,
        onError,
    });

    const createTopicWithConfig = (variables: CreateTopicWithConfig) => {
        mutation.mutate(variables);
    };

    return { createTopicWithConfig, ...mutation };
};
