import { useQuery } from '@tanstack/react-query';
import { orderManagementApis } from '../apis';
import { orderManagementQueryKeys } from '../constants';
import { FilterOrderManagement } from '../types';

export const useExportExcelOrder = (dataFilter: FilterOrderManagement) => {
    const { data, ...res } = useQuery({
        queryKey: [...orderManagementQueryKeys.exportFile, dataFilter],
        queryFn: () => orderManagementApis.exportExcel(dataFilter),
        enabled: false,
    });

    return {
        excelBlob: data,
        ...res,
    };
};
