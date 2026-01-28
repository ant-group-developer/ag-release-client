import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { dspApi } from '../apis';
import { dspQueryKeys } from '../constants/query-keys';
import { UpdateDspRoutingConfig } from '../types/payload';

export const useUpdateDspRoutingConfig = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();
    const onSuccess = (
        data: any,
        { onSuccess, payload }: CreateVariables<UpdateDspRoutingConfig>
    ) => {
        queryClient.invalidateQueries({
            queryKey: dspQueryKeys.detailRoutingConfig(
                payload?.dspId as string
            ),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<UpdateDspRoutingConfig>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<UpdateDspRoutingConfig>) =>
            dspApi.updateDspRoutingConfig(payload),
        onSuccess,
        onError,
    });

    const updateDspRoutingConfig = (
        variables: CreateVariables<UpdateDspRoutingConfig>
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateDspRoutingConfig,
        ...mutation,
    };
};
