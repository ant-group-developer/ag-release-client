import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { issueLevelApis } from '../apis';
import { issueLevelQueryKeys } from '../constants/query-keys';
import { BulkUpdateIssueLevelPayload } from '../types/payloads';

export const useBulkUpdateIssueLevel = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: BulkUpdateIssueLevelPayload
    ) => {
        queryClient.invalidateQueries({
            queryKey: issueLevelQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (error: any, { onError }: BulkUpdateIssueLevelPayload) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: (payload: BulkUpdateIssueLevelPayload) =>
            issueLevelApis.bulkUpdate(payload),
        onSuccess,
        onError,
    });

    const bulkUpdateIssueLevel = (variables: BulkUpdateIssueLevelPayload) => {
        mutation.mutate(variables);
    };

    return {
        bulkUpdateIssueLevel,
        ...mutation,
    };
};
