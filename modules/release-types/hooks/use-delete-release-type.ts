import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releaseTypesApi } from '../apis';
import { releaseTypesQueryKeys } from '../constants/query-keys';
import { ReleaseTypesData } from '../types';

export const useDeleteReleaseType = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<ReleaseTypesData['id']>
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
        { onError }: DeleteVariables<ReleaseTypesData['id']>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<ReleaseTypesData['id']>) =>
            releaseTypesApi.deleteReleaseType(id),
        onSuccess,
        onError,
    });

    const deleteReleaseType = (
        variables: DeleteVariables<ReleaseTypesData['id']>
    ) => {
        mutation.mutate(variables);
    };

    return {
        deleteReleaseType,
        ...mutation,
    };
};
