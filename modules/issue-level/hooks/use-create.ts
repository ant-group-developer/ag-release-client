import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { issueLevelApis } from '../apis';
import { issueLevelQueryKeys } from '../constants/query-keys';
import { CreateIssueLevelPayload } from '../types/payloads';
export const useCreateIssueLevel = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateIssueLevelPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: issueLevelQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        error: any,
        { onError }: CreateVariables<CreateIssueLevelPayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateIssueLevelPayload>) =>
            issueLevelApis.create(payload),
        onSuccess,
        onError,
    });

    const createIssueLevel = (
        variables: CreateVariables<CreateIssueLevelPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createIssueLevel,
        ...mutation,
    };
};
