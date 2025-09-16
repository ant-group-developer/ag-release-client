import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { issueLevelApis } from '../apis';
import { issueLevelQueryKeys } from '../constants/query-keys';
import { IssueLevelData } from '../types';

export const useDeleteIssueLevel = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<IssueLevelData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: issueLevelQueryKeys.lists(),
        });

        handleSuccess(data?.data?.messageCode);
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<IssueLevelData['id']>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<IssueLevelData['id']>) =>
            issueLevelApis.delete(id),
        onSuccess,
        onError,
    });

    const deleteIssueLevel = (
        variables: DeleteVariables<IssueLevelData['id']>
    ) => {
        mutation.mutate(variables);
    };

    return {
        deleteIssueLevel,
        ...mutation,
    };
};
