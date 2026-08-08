import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation } from '@tanstack/react-query';
import { assetImportApis } from '../apis';

export const useDownloadAssetImportTemplate = () => {
    const { handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: assetImportApis.downloadTemplate,
        onSuccess: (response) => {
            const downloadUrl = response?.data?.data?.downloadUrl;

            if (downloadUrl) {
                window.location.assign(downloadUrl);
            }
        },
        onError: handleError,
    });

    return {
        downloadAssetImportTemplate: mutation.mutate,
        ...mutation,
    };
};
