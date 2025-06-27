import { showNotification } from '@/helpers/messages-helper';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { genresApi } from '../apis';
import { genreQueryKeys } from '../constants/query-keys';
import { CreateGenrePayload } from '../types/payload';

export const useCreateGenre = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateGenrePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...genreQueryKeys.getList],
        });
        const responseMessages = messages(data?.data?.messageCode);
        showNotification('success', responseMessages);
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateGenrePayload>
    ) => {
        const responseMessages = messages(data?.response.data.messageCode);
        showNotification('error', responseMessages);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateGenrePayload>) =>
            genresApi.createGenre(payload),
        onSuccess,
        onError,
    });

    const createGenre = (variables: CreateVariables<CreateGenrePayload>) => {
        mutation.mutate(variables);
    };

    return {
        createGenre,
        ...mutation,
    };
};
