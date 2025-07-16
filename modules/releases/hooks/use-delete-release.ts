import { showNotification } from '@/helpers/messages-helper';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releasesApi } from '../apis';
import { ReleasesData } from '../types';

export const useDeleteRelease = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<ReleasesData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...releasesQueryKeys.getDetail],
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<ReleasesData['id']>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
    };
    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<ReleasesData['id']>) =>
            releasesApi.deleteRelease(id),
        onSuccess,
        onError,
    });

    const deleteRelease = (variables: DeleteVariables<ReleasesData['id']>) => {
        return mutation.mutate(variables);
    };

    return {
        deleteRelease,
        ...mutation,
    };
};
