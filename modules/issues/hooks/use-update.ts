import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { issuesApis } from '../apis';
import { issuesQueryKeys } from '../constants/query-keys';
import { IssueData } from '../types';
import { UpdateIssuePayload } from '../types/payloads';

export const useUpdateIssue = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: UpdateVariables<IssueData['id'], UpdateIssuePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: issuesQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        error: any,
        { onError }: UpdateVariables<IssueData['id'], UpdateIssuePayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<IssueData['id'], UpdateIssuePayload>) =>
            issuesApis.update(id, payload),
        onSuccess,
        onError,
    });

    const updateIssue = (
        variables: UpdateVariables<IssueData['id'], UpdateIssuePayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateIssue,
        ...mutation,
    };
};
