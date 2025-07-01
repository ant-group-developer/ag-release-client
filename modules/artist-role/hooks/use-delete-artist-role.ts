import { showNotification } from '@/helpers/messages-helper';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { artistRoleApi } from '../apis';
import { ArtistRoleQueryKeys } from '../constants/query-keys';
import { ArtistRoleData } from '../types';

export const useDeleteArtistRole = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<ArtistRoleData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...ArtistRoleQueryKeys.getList],
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
        showNotification('error', responseMessages);
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
