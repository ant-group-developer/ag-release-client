import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { dspApi } from '../apis';
import { dspQueryKeys } from '../constants/query-keys';
import { CreateDspPayload } from '../types/payload';

export const useCreateDsp = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();
    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateDspPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: dspQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateDspPayload>
    ) => {
        onError?.();
        handleError(data);
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
