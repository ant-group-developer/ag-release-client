import { showNotification } from '@/helpers/messages-helper';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releaseArtistApi } from '../apis';
import { releaseArtistQueryKeys } from '../constants/query-keys';
import { ReleaseArtist } from '../types';

export const useDeleteReleaseArtist = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<ReleaseArtist['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releaseArtistQueryKeys.lists(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.details(),
        });

        // const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        // showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<ReleaseArtist['id']>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
    };
    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<ReleaseArtist['id']>) =>
            releaseArtistApi.deleteReleaseArtist(id),
        onSuccess,
        onError,
    });

    const deleteReleaseArtist = (
        variables: DeleteVariables<ReleaseArtist['id']>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        deleteReleaseArtist,
        ...mutation,
    };
};
