import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { newsCategoryApis } from '../apis';
import { newsCategoryQueryKeys } from '../constants/query-keys';
import { NewsCategoryData } from '../types';

export const useDeleteNewsCategory = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<NewsCategoryData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: newsCategoryQueryKeys.all,
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<NewsCategoryData['id']>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<NewsCategoryData['id']>) =>
            newsCategoryApis.delete(id),
        onSuccess,
        onError,
    });

    const deleteNewsCategory = (
        variables: DeleteVariables<NewsCategoryData['id']>
    ) => {
        mutation.mutate(variables);
    };

    return {
        deleteNewsCategory,
        ...mutation,
    };
};
