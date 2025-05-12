import { showNotification } from '@/helpers/messages-helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { topicApi } from '../apis';
import { topicQueryKeys } from '../constants';
import { UpdateTopicOrder } from '../types/update-topic';

export const useUpdateTopicOrder = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const handleSuccess = (data: any, { onSuccess }: UpdateTopicOrder) => {
        queryClient.invalidateQueries({ queryKey: topicQueryKeys.getList });
        showNotification('success', messages(data?.data?.message));
        onSuccess?.();
    };

    const handleOnErrors = (data: any) => {
        showNotification('error', messages(data?.response?.data?.message));
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: UpdateTopicOrder) =>
            topicApi.updateTopicOrder(payload),
        onSuccess: handleSuccess,
        onError: handleOnErrors,
    });

    const updateTopicOrder = (variables: UpdateTopicOrder) => {
        mutation.mutate(variables);
    };

    return { updateTopicOrder, ...mutation };
};
