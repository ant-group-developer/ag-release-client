import { exportFileExcel } from '@/helpers/common';
import { toastPromise } from '@/helpers/messages-helper';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releaseDistributionApi } from '../apis';
import { ReleaseCiDataFilter } from '../types';

export const useExportReleaseCiData = () => {
    const messages = useTranslations();
    const mutation = useMutation({
        mutationFn: (variables?: ReleaseCiDataFilter) =>
            releaseDistributionApi.exportReleaseCiData(variables),
        onSuccess: (data) => {
            const blob = new Blob([data?.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            return exportFileExcel(blob, 'release-ci-data-export.xlsx');
        },
    });

    const exportReleaseCiData = (variables?: ReleaseCiDataFilter) => {
        return toastPromise(mutation.mutateAsync(variables), messages, {
            success: messages('common.success'),
        });
    };

    return { ...mutation, exportReleaseCiData };
};
