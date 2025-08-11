import { showNotification } from '@/helpers/messages-helper';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { artistRoleApi } from '../apis';
import { artistRoleQueryKeys } from '../constants/query-keys';
import { ArtistRoleData } from '../types';

export const useDeleteArtistRole = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<ArtistRoleData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: artistRoleQueryKeys.list(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.details(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<ArtistRoleData['id']>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
    };
    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<ArtistRoleData['id']>) =>
            artistRoleApi.deleteArtistRole(id),
        onSuccess,
        onError,
    });

    const deleteArtistRole = (
        variables: DeleteVariables<ArtistRoleData['id']>
    ) => {
        mutation.mutate(variables);
    };

    return {
        deleteArtistRole,
        ...mutation,
    };
};
