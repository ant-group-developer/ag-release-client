import { exportFileExcel } from '@/helpers/common';
import { useQuery } from '@tanstack/react-query';
import { releasesApi } from '../apis';

export const useExportTemplateCi = () => {
    const { data, ...rest } = useQuery({
        queryKey: ['export-template-ci'],
        queryFn: () => releasesApi.exportTemplateCi(),
    });

    const handleDownloadTemplate = () => {
        if (!data?.data) return;
        const blob = new Blob([data?.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        return exportFileExcel(blob, 'CI-export.xlsx');
    };

    return { data, ...rest, handleDownloadTemplate };
};
