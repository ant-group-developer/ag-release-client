import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { newsCategoryApis } from '../apis';
import { newsCategoryQueryKeys } from '../constants/query-keys';
import { BulkUpdateNewsCategoryPayload } from '../types/payloads';

export const useBulkUpdateNewsCategory = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: BulkUpdateNewsCategoryPayload
    ) => {
        queryClient.invalidateQueries({
            queryKey: newsCategoryQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        error: any,
        { onError }: BulkUpdateNewsCategoryPayload
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: (payload: BulkUpdateNewsCategoryPayload) =>
            newsCategoryApis.bulkUpdate(payload),
        onSuccess,
        onError,
    });

    const bulkUpdateNewsCategory = (
        variables: BulkUpdateNewsCategoryPayload
    ) => {
        mutation.mutate(variables);
    };

    return {
        bulkUpdateNewsCategory,
        ...mutation,
    };
};
