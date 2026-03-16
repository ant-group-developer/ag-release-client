import { useMutation } from '@tanstack/react-query';
import { releasesApi } from '../apis';

export const useDownloadTemplate = () => {
    return useMutation({
        mutationFn: () => releasesApi.downloadTemplate(),
        onSuccess: (data: any) => {
            const blob = new Blob([data.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'template.xlsx';

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
    });
};
