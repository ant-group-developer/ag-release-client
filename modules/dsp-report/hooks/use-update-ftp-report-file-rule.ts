import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { dspReportApi } from '../apis';
import { dspReportQueryKeys } from '../constants/query-keys';
import { FtpReportFileRule } from '../types';

export const useUpdateFtpReportFileRule = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: UpdateVariables<string, Partial<FtpReportFileRule>>
    ) => {
        queryClient.invalidateQueries({
            queryKey: dspReportQueryKeys.ftpReportFileRulesDetails(),
        });

        const responseMessages = data?.data?.messageCode
            ? messages(data.data.messageCode as any)
            : messages('common.updateSuccess' as any);

        onSuccess?.(data);
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: UpdateVariables<string, Partial<FtpReportFileRule>>
    ) => {
        onError?.(data);
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<string, Partial<FtpReportFileRule>>) =>
            dspReportApi.updateFtpReportFileRule(id, payload),
        onSuccess,
        onError,
    });

    const updateFtpReportFileRule = (
        variables: UpdateVariables<string, Partial<FtpReportFileRule>>
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateFtpReportFileRule,
        isUpdating: mutation.isPending,
        ...mutation,
    };
};
