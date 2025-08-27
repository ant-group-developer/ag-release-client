import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { genresApi } from '../apis';
import { genreQueryKeys } from '../constants/query-keys';
import { GenresData } from '../types';
import { UpdateGenrePayload } from '../types/payload';

export const useUpdateGenre = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (
        data: any,
        { onSuccess }: UpdateVariables<GenresData['id'], UpdateGenrePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: genreQueryKeys.lists(),
        });
        const responseMessages = messages(data?.data?.messageCode);
        showNotification('success', responseMessages);
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: UpdateVariables<GenresData['id'], UpdateGenrePayload>
    ) => {
        handleError(data);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<GenresData['id'], UpdateGenrePayload>) =>
            genresApi.updateGenre(id, payload),
        onSuccess,
        onError,
    });

    const updateGenre = (
        variables: UpdateVariables<GenresData['id'], UpdateGenrePayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateGenre,
        ...mutation,
    };
};
