import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releaseTypesApi } from '../apis';
import { releaseTypesQueryKeys } from '../constants/query-keys';
import { ReleaseTypesData } from '../types';
import { UpdateReleaseTypePayload } from '../types/payload';

export const useUpdateReleaseType = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<ReleaseTypesData['id'], UpdateReleaseTypePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releaseTypesQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        {
            onError,
        }: UpdateVariables<ReleaseTypesData['id'], UpdateReleaseTypePayload>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<ReleaseTypesData['id'], UpdateReleaseTypePayload>) =>
            releaseTypesApi.updateReleaseType(id, payload),
        onSuccess,
        onError,
    });

    const updateReleaseType = (
        variables: UpdateVariables<
            ReleaseTypesData['id'],
            UpdateReleaseTypePayload
        >
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateReleaseType,
        ...mutation,
    };
};
