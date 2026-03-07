import { useMutation } from '@tanstack/react-query';
import { releasesApi } from '../apis';

export const useDownloadTemplate = () => {
    return useMutation({
        mutationFn: () => releasesApi.downloadTemplate(),
        onSuccess: (data: any) => {
            const url = data?.data?.data;
            const link = document.createElement('a');
            link.href = url;
            link.download = 'template.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },
    });
};
