import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { dspReportQueryKeys } from '@/modules/dsp-report/constants/query-keys';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { dspReportApi } from '../apis';

type DeleteDspReportVariables = DeleteVariables<string>;

export const useDeleteDspReport = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = async (data: any, { onSuccess }: DeleteDspReportVariables) => {
        await queryClient.invalidateQueries({
            queryKey: dspReportQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (data: any, { onError }: DeleteDspReportVariables) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationKey: dspReportQueryKeys.all,
        mutationFn: ({ id }: DeleteDspReportVariables) => dspReportApi.delete(id),
        onSuccess,
        onError,
    });

    const deleteDspReport = (variables: DeleteDspReportVariables) => {
        return mutation.mutate(variables);
    };

    return {
        deleteDspReport,
        ...mutation,
    };
};
