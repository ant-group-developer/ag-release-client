import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { integrationApis } from '../apis';
import { integrationQueryKeys } from '../constants';
import { IntegrationData } from '../types';
import { UpdateIntegrationPayload } from '../types/payload';

export const useUpdateIntegration = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        {
            id,
            onSuccess,
        }: UpdateVariables<IntegrationData['id'], UpdateIntegrationPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: integrationQueryKeys.lists(),
        });
        queryClient.invalidateQueries({
            queryKey: integrationQueryKeys.detail(id),
        });
        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        error: any,
        {
            onError,
        }: UpdateVariables<IntegrationData['id'], UpdateIntegrationPayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<IntegrationData['id'], UpdateIntegrationPayload>) =>
            integrationApis.update(id, payload),
        onSuccess,
        onError,
    });

    const updateIntegration = (
        variables: UpdateVariables<
            IntegrationData['id'],
            UpdateIntegrationPayload
        >
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateIntegration,
        ...mutation,
    };
};
