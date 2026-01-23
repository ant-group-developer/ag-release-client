import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { dealTypeApis } from '../apis';
import { dealTypeQueryKeys } from '../constants/query-keys';
import { DealTypeData } from '../types';
import { UpdateDealTypePayload } from '../types/payloads';

export const useUpdateDealType = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<DealTypeData['id'], UpdateDealTypePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: dealTypeQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        error: any,
        { onError }: UpdateVariables<DealTypeData['id'], UpdateDealTypePayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<DealTypeData['id'], UpdateDealTypePayload>) =>
            dealTypeApis.update(id, payload),
        onSuccess,
        onError,
    });

    const updateDealType = (
        variables: UpdateVariables<DealTypeData['id'], UpdateDealTypePayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateDealType,
        ...mutation,
    };
};
