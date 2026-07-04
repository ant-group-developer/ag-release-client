import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { newsCategoryApis } from '../apis';
import { newsCategoryQueryKeys } from '../constants/query-keys';
import { NewsCategoryData } from '../types';
import { UpdateNewsCategoryPayload } from '../types/payloads';

export const useUpdateNewsCategory = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<NewsCategoryData['id'], UpdateNewsCategoryPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: newsCategoryQueryKeys.all,
        });

        handleSuccess(data?.data);
        onSuccess?.(data?.data?.data);
    };

    const onError = (
        error: any,
        {
            onError,
        }: UpdateVariables<NewsCategoryData['id'], UpdateNewsCategoryPayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<
            NewsCategoryData['id'],
            UpdateNewsCategoryPayload
        >) => newsCategoryApis.update(id, payload),
        onSuccess,
        onError,
    });

    const updateNewsCategory = (
        variables: UpdateVariables<
            NewsCategoryData['id'],
            UpdateNewsCategoryPayload
        >
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateNewsCategory,
        ...mutation,
    };
};
