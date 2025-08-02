import { showNotification } from '@/helpers/messages-helper';
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

    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<ReleaseTypesData['id'], UpdateReleaseTypePayload>
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
        {
            onError,
        }: UpdateVariables<ReleaseTypesData['id'], UpdateReleaseTypePayload>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
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
