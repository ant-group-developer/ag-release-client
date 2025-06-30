import { showNotification } from '@/helpers/messages-helper';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { genresApi } from '../apis';
import { genreQueryKeys } from '../constants/query-keys';
import { GenresData } from '../types';

export const useDeleteGenre = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<GenresData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...genreQueryKeys.getList],
        });

        showNotification('success', messages(data.data.message));
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<GenresData['id']>
    ) => {
        showNotification('error', messages(data?.response?.data?.message));
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<GenresData['id']>) =>
            genresApi.deleteGenre(id),
        onSuccess,
        onError,
    });

    const deleteGenre = (variables: DeleteVariables<GenresData['id']>) => {
        mutation.mutate(variables);
    };

    return {
        deleteGenre,
        ...mutation,
    };
};
