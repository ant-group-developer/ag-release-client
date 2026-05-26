import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releaseVideoApi } from '../apis';
import { releaseVideoQueryKeys } from '../constants/query-keys';
import { ReleaseVideoData } from '../types';

export const useDeleteReleaseVideo = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<ReleaseVideoData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releaseVideoQueryKeys.lists(),
        });
        const responseMessages = messages(data?.data?.messageCode || 'message.deleteSuccessfully');
        showNotification('success', responseMessages);
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<ReleaseVideoData['id']>
    ) => {
        handleError(data);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<ReleaseVideoData['id']>) =>
            releaseVideoApi.delete(id),
        onSuccess,
        onError,
    });

    const deleteReleaseVideo = (variables: DeleteVariables<ReleaseVideoData['id']>) => {
        mutation.mutate(variables);
    };

    return {
        deleteReleaseVideo,
        ...mutation,
    };
};
