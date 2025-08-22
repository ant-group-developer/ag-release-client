import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { CommonFunction } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { backupDatabaseApis } from '../apis';

export const useBackupDatabase = () => {
    const messages = useTranslations();
    const { handleError } = useApiError();
    const onSuccess = (data: any, { onSuccess }: any) => {
        const responseMessages = messages(data?.data?.messageCode);
        onSuccess?.();
        showNotification('success', 'Success');
    };

    const onError = (error: any, { onError }: any) => {
        onError?.();
        handleError(error);
    };
    const mutation = useMutation({
        mutationFn: () => backupDatabaseApis.backupDatabase(),
        onError,
        onSuccess,
    });

    return {
        backupDatabase: (variables: CommonFunction) =>
            mutation.mutate(variables),
        ...mutation,
    };
};
