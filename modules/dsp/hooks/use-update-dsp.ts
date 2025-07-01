import { showNotification } from '@/helpers/messages-helper';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { dspApi } from '../apis';
import { dspQueryKeys } from '../constants/query-keys';
import { DspData } from '../types';
import { UpdateDspPayload } from '../types/payload';

export const useUpdateDsp = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: UpdateVariables<DspData['id'], UpdateDspPayload>
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
        { onError }: UpdateVariables<DspData['id'], UpdateDspPayload>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification('error', responseMessages);
    };
    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<DspData['id'], UpdateDspPayload>) =>
            dspApi.updateDsp(id, payload),
        onSuccess,
        onError,
    });

    const updateDsp = (
        variables: UpdateVariables<DspData['id'], UpdateDspPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateDsp,
        ...mutation,
    };
};
