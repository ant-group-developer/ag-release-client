import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { issueLevelApis } from '../apis';
import { issueLevelQueryKeys } from '../constants/query-keys';
import { IssueLevelData } from '../types';
import { UpdateIssueLevelPayload } from '../types/payloads';

export const useUpdateIssueLevel = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<IssueLevelData['id'], UpdateIssueLevelPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: issueLevelQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        error: any,
        {
            onError,
        }: UpdateVariables<IssueLevelData['id'], UpdateIssueLevelPayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<IssueLevelData['id'], UpdateIssueLevelPayload>) =>
            issueLevelApis.update(id, payload),
        onSuccess,
        onError,
    });

    const updateIssueLevel = (
        variables: UpdateVariables<
            IssueLevelData['id'],
            UpdateIssueLevelPayload
        >
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateIssueLevel,
        ...mutation,
    };
};
