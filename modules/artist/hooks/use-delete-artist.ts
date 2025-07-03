import { showNotification } from '@/helpers/messages-helper';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { artistApi } from '../apis';
import { artistQueryKeys } from '../constants/query-keys';
import { ArtistData } from '../types';

export const useDeleteArtist = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<ArtistData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...artistQueryKeys.getList],
        });

        showNotification('success', messages(data.data.messageCode));
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<ArtistData['id']>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        showNotification(
            'error',
            responseMessages ?? messages('common.somethingWentWrong')
        );
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<ArtistData['id']>) =>
            artistApi.deleteArtist(id),
        onSuccess,
        onError,
    });

    const deleteArtist = (variables: DeleteVariables<ArtistData['id']>) => {
        mutation.mutate(variables);
    };

    return {
        deleteArtist,
        ...mutation,
    };
};
