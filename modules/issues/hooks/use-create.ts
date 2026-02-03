import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { issuesApis } from '../apis';
import { issuesQueryKeys } from '../constants/query-keys';
import { CreateIssuePayload } from '../types/payloads';

export const useCreateIssue = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateIssuePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: issuesQueryKeys.lists(),
        });

        handleSuccess(data?.data);

        onSuccess?.();
    };

    const onError = (
        error: any,
        { onError }: CreateVariables<CreateIssuePayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateIssuePayload>) =>
            issuesApis.create(payload),
        onSuccess,
        onError,
    });

    const createIssue = (variables: CreateVariables<CreateIssuePayload>) => {
        mutation.mutate(variables);
    };

    return {
        createIssue,
        ...mutation,
    };
};
