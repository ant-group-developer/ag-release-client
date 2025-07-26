import { showNotification } from '@/helpers/messages-helper';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { dspApi } from '../apis';
import { dspQueryKeys } from '../constants/query-keys';
import { CreateDspPayload } from '../types/payload';

export const useCreateDsp = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateDspPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...dspQueryKeys.getList],
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateDspPayload>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
    };
    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateDspPayload>) =>
            dspApi.createDsp(payload),
        onSuccess,
        onError,
    });

    const createDsp = (variables: CreateVariables<CreateDspPayload>) => {
        mutation.mutate(variables);
    };

    return {
        createDsp,
        ...mutation,
    };
};
