import { showNotification } from '@/helpers/messages-helper';
import { uploadApi } from '@/modules/upload/apis';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { GetUrlUploadPayload } from '../modules/product/types';

export const useGetUrlUpload = () => {
    const messages = useTranslations();
    const onSuccess = (data: any, { onSuccess }: GetUrlUploadPayload) => {
        onSuccess?.();
    };

    const onError = (data: any, { onError }: GetUrlUploadPayload) => {
        showNotification('error', messages('file.message.uploadFileFailed'));
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: GetUrlUploadPayload) =>
            uploadApi.uploadFile(payload),
        onSuccess,
        onError,
    });

    const getUrlUpload = (payload: GetUrlUploadPayload) => {
        return mutation.mutateAsync(payload);
    };

    return { getUrlUpload, ...mutation };
};
