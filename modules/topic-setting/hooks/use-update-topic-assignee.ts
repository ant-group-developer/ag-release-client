import { showNotification } from '@/helpers/messages-helper';
import { topicQueryKeys } from '@/modules/topic/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { topicSettingApi } from '../apis';
import { UpdateTopicAssignee } from '../types';

export const useUpdateTopicAssignee = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const onSuccess = (data: any, { onSuccess }: UpdateTopicAssignee) => {
        showNotification('success', messages('message.updateSuccessfully'));

        queryClient.invalidateQueries({
            queryKey: topicQueryKeys.getListAll,
            exact: false,
            refetchType: 'active',
        });

        queryClient.invalidateQueries({
            queryKey: topicQueryKeys.getTopicAssignee,
            exact: false,
            refetchType: 'active',
        });

        onSuccess?.();
    };

    const onError = (data: any, { onError }: UpdateTopicAssignee) => {
        showNotification('error', messages(data?.response?.data?.message));
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: UpdateTopicAssignee) =>
            topicSettingApi.updateTopicAssignee(payload),
        onSuccess,
        onError,
    });

    const updateTopicAssignee = (variables: UpdateTopicAssignee) => {
        mutation.mutate(variables);
    };

    return { updateTopicAssignee, ...mutation };
};
