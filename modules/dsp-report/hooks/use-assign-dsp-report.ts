import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { dspReportQueryKeys } from '@/modules/dsp-report/constants/query-keys';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { dspReportApi } from '../apis';

type AssignVariables = UpdateVariables<string, { pgUuid: string }>;

export const useAssignDspReport = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = async (data: any, { onSuccess }: AssignVariables) => {
        await queryClient.invalidateQueries({
            queryKey: dspReportQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (data: any, { onError }: AssignVariables) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationKey: dspReportQueryKeys.all,
        mutationFn: ({ id, payload }: AssignVariables) =>
            dspReportApi.assign(id, payload),
        onSuccess,
        onError,
    });

    const assignDspReport = (variables: AssignVariables) => {
        return mutation.mutate(variables);
    };

    return {
        assignDspReport,
        ...mutation,
    };
};
