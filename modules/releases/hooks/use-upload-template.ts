import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { bucketApi } from '@/modules/upload/apis/bucket-api';
import { CreateVariables } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releasesApi } from '../apis';
import { UploadTemplate } from '../types/payload';

export const useUploadTemplate = () => {
    const { handleError, handleSuccess } = useApiNotify();
    const messages = useTranslations();

    const onSuccess = async (
        data: any,
        { onSuccess }: CreateVariables<UploadTemplate>
    ) => {
        const fileId = data;
        await bucketApi.submit({ ids: [fileId] });
        showNotification('success', messages('release.uploadTemplateSuccess'));
        onSuccess?.();
    };

    const onError = (
        error: any,
        { onError }: CreateVariables<UploadTemplate>
    ) => {
        showNotification('error', messages('release.uploadTemplateError'));
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<UploadTemplate>) => {
            return releasesApi.createBucket(
                payload.file,
                payload.createBucketFile
            );
        },
        onSuccess,
        onError,
    });

    const uploadTemplate = (variables: CreateVariables<UploadTemplate>) => {
        return mutation.mutate(variables);
    };

    return {
        uploadTemplate,
        ...mutation,
    };
};
