import { showNotification } from '@/helpers/messages-helper';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { artistApi } from '../apis';
import { artistQueryKeys } from '../constants/query-keys';
import { ArtistData } from '../types';
import { UpdateArtistPayload } from '../types/payload';

export const useUpdateArtist = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: UpdateVariables<ArtistData['id'], UpdateArtistPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...artistQueryKeys.getList],
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: UpdateVariables<ArtistData['id'], UpdateArtistPayload>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification('error', responseMessages);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<ArtistData['id'], UpdateArtistPayload>) =>
            artistApi.updateArtist(id, payload),
        onSuccess,
        onError,
    });

    const updateArtist = (
        variables: UpdateVariables<ArtistData['id'], UpdateArtistPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateArtist,
        ...mutation,
    };
};
