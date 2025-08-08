import { showNotification } from '@/helpers/messages-helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { artistApi } from '../apis';
import { artistQueryKeys } from '../constants/query-keys';
import { DeleteArtistProfiles } from '../types/payload';

export const useDeleteArtistProfile = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (data: any, { onSuccess }: DeleteArtistProfiles) => {
        queryClient.invalidateQueries({
            queryKey: [...artistQueryKeys.getList],
        });

        // showNotification('success', messages(data.data.messageCode));
        onSuccess?.();
    };

    const onError = (data: any, { onError }: DeleteArtistProfiles) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        showNotification(
            'error',
            responseMessages ?? messages('common.somethingWentWrong')
        );
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ artistId, profileId }: DeleteArtistProfiles) =>
            artistApi.deleteArtistProfiles({ artistId, profileId }),
        onSuccess,
        onError,
    });

    const deleteArtistProfile = (variables: DeleteArtistProfiles) => {
        mutation.mutate(variables);
    };

    return {
        deleteArtistProfile,
        ...mutation,
    };
};
