import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { dspDealApis } from '../apis';
import { dspDealQueryKeys } from '../constants/query-keys';
import { DspDealData } from '../types';
import { UpdateDspDealPayload } from '../types/payload';

export const useUpdateDspDeal = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: UpdateVariables<DspDealData['id'], UpdateDspDealPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: dspDealQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        error: any,
        { onError }: UpdateVariables<DspDealData['id'], UpdateDspDealPayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<DspDealData['id'], UpdateDspDealPayload>) =>
            dspDealApis.update(id, payload),
        onSuccess,
        onError,
    });

    const updateDspDeal = (
        variables: UpdateVariables<DspDealData['id'], UpdateDspDealPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateDspDeal,
        ...mutation,
    };
};
