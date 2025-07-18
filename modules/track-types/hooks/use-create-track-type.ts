import { showNotification } from '@/helpers/messages-helper';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackTypeApi } from '../apis';
import { trackTypeQueryKeys } from '../constants/query-keys';
import { CreateTrackTypePayload } from '../types/payload';

export const useCreateTrackType = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateTrackTypePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...trackTypeQueryKeys.getList],
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateTrackTypePayload>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateTrackTypePayload>) =>
            trackTypeApi.createTrackType(payload),
        onSuccess,
        onError,
    });

    const createTrackType = (
        variables: CreateVariables<CreateTrackTypePayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createTrackType,
        ...mutation,
    };
};
