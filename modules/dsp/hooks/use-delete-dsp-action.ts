import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { dspApi } from '../apis';
import { dspQueryKeys } from '../constants/query-keys';
import { DeleteDspAction } from '../types/payload';

export const useDeleteDspAction = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (data: any, { onSuccess }: DeleteDspAction) => {
        queryClient.invalidateQueries({
            queryKey: dspQueryKeys.lists(),
        });

        // showNotification('success', messages(data.data.messageCode));
        onSuccess?.();
    };

    const onError = (data: any, { onError }: DeleteDspAction) => {
        handleError(data);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ dspId, actionId }: DeleteDspAction) =>
            dspApi.deleteDspAction({ dspId, actionId }),
        onSuccess,
        onError,
    });

    const deleteDspAction = (variables: DeleteDspAction) => {
        mutation.mutate(variables);
    };

    return {
        deleteDspAction,
        ...mutation,
    };
};
