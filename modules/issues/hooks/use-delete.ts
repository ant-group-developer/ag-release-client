import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { issuesApis } from '../apis';
import { issuesQueryKeys } from '../constants/query-keys';
import { IssueData } from '../types';

export const useDeleteIssue = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<IssueData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: issuesQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<IssueData['id']>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<IssueData['id']>) =>
            issuesApis.delete(id),
        onSuccess,
        onError,
    });

    const deleteIssue = (variables: DeleteVariables<IssueData['id']>) => {
        mutation.mutate(variables);
    };

    return {
        deleteIssue,
        ...mutation,
    };
};
