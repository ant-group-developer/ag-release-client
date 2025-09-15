import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { artistApi } from '../apis';
import { artistQueryKeys } from '../constants/query-keys';
import { CreateArtistPayload } from '../types/payload';

export const useCreateArtist = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();
    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateArtistPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: artistQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateArtistPayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateArtistPayload>) =>
            artistApi.createArtist(payload),
        onSuccess,
        onError,
    });

    const createArtist = (variables: CreateVariables<CreateArtistPayload>) => {
        mutation.mutate(variables);
    };

    return {
        createArtist,
        ...mutation,
    };
};
