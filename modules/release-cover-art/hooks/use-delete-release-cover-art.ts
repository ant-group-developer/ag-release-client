import { showNotification } from '@/helpers/messages-helper';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releaseCoverArtApi } from '../apis';

export const useDeleteReleaseCoverArt = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (data: any, { onSuccess }: DeleteVariables<string>) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.details(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (data: any, { onError }: DeleteVariables<string>) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
    };
    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<string>) =>
            releaseCoverArtApi.deleteReleaseCoverArt(id),
        onSuccess,
        onError,
    });

    const deleteReleaseCoverArt = (variables: DeleteVariables<string>) => {
        return mutation.mutate(variables);
    };

    return { deleteReleaseCoverArt, mutation };
};
