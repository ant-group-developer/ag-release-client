import { showNotification } from '@/helpers/messages-helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { topicApi } from '../apis';
import { topicQueryKeys } from '../constants';
import { UpdateTopic, UpdateTopicWithConfig } from '../types/update-topic';

export const useUpdateTopic = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const onSuccess = (data: any, { onSuccess }: UpdateTopic) => {
        queryClient.invalidateQueries({ queryKey: topicQueryKeys.getList });
        showNotification('success', messages(data.data.message));
        onSuccess?.();
    };

    const onError = (data: any, { onSuccess, onError }: UpdateTopic) => {
        showNotification('error', messages(data.response.data.message));
        const errors = data.response.data.errors;
        onError?.(errors);
    };

    const mutation = useMutation({
        mutationFn: ({ topicId, payload }: UpdateTopic) =>
            topicApi.updateTopic(topicId, payload),
        onSuccess,
        onError,
    });

    const updateTopic = (variables: UpdateTopic) => {
        mutation.mutate(variables);
    };

    return { updateTopic, ...mutation };
};

export const useUpdateTopicWithConfig = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const onSuccess = (data: any, { onSuccess }: UpdateTopicWithConfig) => {
        queryClient.invalidateQueries({ queryKey: topicQueryKeys.getList });
        queryClient.invalidateQueries({ queryKey: topicQueryKeys.getDetail });

        showNotification('success', messages(data.data.message));
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onSuccess, onError }: UpdateTopicWithConfig
    ) => {
        showNotification('error', messages(data.response.data.message));
        const errors = data.response.data.errors;
        onError?.(errors);
    };

    const mutation = useMutation({
        mutationFn: ({ topicId, payload }: UpdateTopicWithConfig) =>
            topicApi.updateTopicWithConfig(topicId, payload),
        onSuccess,
        onError,
    });

    const updateTopicWithConfig = (variables: UpdateTopicWithConfig) => {
        mutation.mutate(variables);
    };

    return { updateTopicWithConfig, ...mutation };
};
