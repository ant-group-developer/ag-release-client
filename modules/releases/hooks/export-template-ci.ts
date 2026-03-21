import { exportFileExcel } from '@/helpers/common';
import { toastPromise } from '@/helpers/messages-helper';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releasesApi } from '../apis';
import { ExportTemplateCi } from '../types/payload';

export const useExportTemplateCi = () => {
    const messages = useTranslations();
    const mutation = useMutation({
        mutationFn: (variables: ExportTemplateCi) =>
            releasesApi.exportTemplateCi(variables),
        onSuccess: (data) => {
            const blob = new Blob([data?.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            return exportFileExcel(blob, 'CI-export.xlsx');
        },
    });

    const exportTemplateCi = (variables: ExportTemplateCi) => {
        return toastPromise(mutation.mutateAsync(variables), messages, {
            success: messages('common.success'),
        });
    };

    return { ...mutation, exportTemplateCi };
};
