import { useQuery } from '@tanstack/react-query';
import { productManagementApis } from '../apis';
import { productManagementQueryKeys } from '../constants';
import { FilterProductManagement } from '../types';

export const useExportExcelOrderProduct = (
    dataFilter: FilterProductManagement
) => {
    const { data, ...res } = useQuery({
        queryKey: [...productManagementQueryKeys.exportFile, dataFilter],
        queryFn: () => productManagementApis.exportExcel(dataFilter),
        enabled: false,
    });

    return {
        excelBlob: data,
        ...res,
    };
};
