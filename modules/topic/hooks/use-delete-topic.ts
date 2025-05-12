import { showNotification } from '@/helpers/messages-helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { topicApi } from '../apis';
import { topicQueryKeys } from '../constants';
import { DeleteTopic } from '../types/delete-topics';

export const useDeleteTopic = () => {
    const messages = useTranslations();
    const handleOnSuccess = (data: any, { onSuccess }: DeleteTopic) => {
        queryClient.invalidateQueries({ queryKey: topicQueryKeys.getList });
        showNotification('success', messages(data.data.message));
        onSuccess?.();
    };

    const handleOnError = (data: any) => {
        showNotification('error', messages(data.response.data.message));
    };

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: ({ topicId }: DeleteTopic) => topicApi.deleteTopic(topicId),
        onSuccess: handleOnSuccess,
        onError: handleOnError,
    });

    const deleteTopic = (variables: DeleteTopic) => mutation.mutate(variables);

    return { deleteTopic, ...mutation };
};
