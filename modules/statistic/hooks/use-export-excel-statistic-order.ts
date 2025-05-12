export interface ParamsExportExcelStatisticOrder {
    startDateDeadline: string;
    endDateDeadline: string;
    groupIds: string;
}

import { ExportFileExcel } from '@/helpers/common';
import { showNotification } from '@/helpers/messages-helper';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { statisticApis } from '../apis';

// export const useExportExcelStatisticOrder = () => {
//     const messages = useTranslations();
//     const mutation = useMutation<Blob, Error, ParamsExportExcelStatisticOrder>({
//         mutationFn: (params) => statisticApis.exportExcel(params),
//         onSuccess: (blob) => {
//             ExportFileExcel(blob, 'order_statistics_by_groups.xlsx');
//         },
//         onError: (err) => {
//             showNotification('error', messages('message.exportExcelFailed'));
//         },
//     });

//     return { exportExcelStatisticOrder: mutation.mutate, ...mutation };
// };

export const useExportExcelStatisticOrder = () => {
    const messages = useTranslations();

    const mutation = useMutation<Blob, Error, ParamsExportExcelStatisticOrder>({
        mutationFn: (params) => statisticApis.exportExcel(params),
        onSuccess: (blob) => {
            ExportFileExcel(blob, 'order_statistics_by_groups.xlsx');
        },
        onError: (err) => {
            showNotification('error', messages('message.exportExcelFailed'));
        },
    });

    return {
        exportExcelStatisticOrder: mutation.mutate,
        exportExcelStatisticOrderAsync: mutation.mutateAsync,
        ...mutation,
    };
};
