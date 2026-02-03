import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { dspApi } from '../apis';
import { dspQueryKeys } from '../constants/query-keys';
import { DspData } from '../types';

export const useDeleteDsp = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<DspData['id']>
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
        { onError }: DeleteVariables<DspData['id']>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<DspData['id']>) =>
            dspApi.deleteDsp(id),
        onSuccess,
        onError,
    });

    const deleteDsp = (variables: DeleteVariables<DspData['id']>) => {
        mutation.mutate(variables);
    };

    return {
        deleteDsp,
        ...mutation,
    };
};
