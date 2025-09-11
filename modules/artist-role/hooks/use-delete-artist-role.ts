import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
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
    const { handleError } = useApiNotify();
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
        onError?.();
        handleError(data);
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
