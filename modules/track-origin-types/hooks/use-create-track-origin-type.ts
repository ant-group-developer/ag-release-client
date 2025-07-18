import { showNotification } from '@/helpers/messages-helper';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackOriginTypeApi } from '../apis';
import { trackOriginTypeQueryKeys } from '../constants/query-keys';
import { CreateTrackOriginTypePayload } from '../types/payload';

export const useCreateTrackOriginType = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateTrackOriginTypePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...trackOriginTypeQueryKeys.getList],
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateTrackOriginTypePayload>
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
            payload,
        }: CreateVariables<CreateTrackOriginTypePayload>) =>
            trackOriginTypeApi.createTrackOriginType(payload),
        onSuccess,
        onError,
    });

    const createTrackOriginType = (
        variables: CreateVariables<CreateTrackOriginTypePayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createTrackOriginType,
        ...mutation,
    };
};
