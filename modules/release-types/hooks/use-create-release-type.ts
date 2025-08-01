import { showNotification } from '@/helpers/messages-helper';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releaseTypesApi } from '../apis';
import { releaseTypesQueryKeys } from '../constants/query-keys';
import { CreateReleaseTypePayload } from '../types/payload';

export const useCreateReleaseType = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateReleaseTypePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...releaseTypesQueryKeys.getList],
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateReleaseTypePayload>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateReleaseTypePayload>) =>
            releaseTypesApi.createReleaseType(payload),
        onSuccess,
        onError,
    });

    const createReleaseType = (
        variables: CreateVariables<CreateReleaseTypePayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createReleaseType,
        ...mutation,
    };
};
