import { useQuery } from '@tanstack/react-query';
import { reportConfigApis } from '../apis';
import { reportConfigQueryKeys } from '../constants/query-keys';
import { ReportConfigData } from '../types';

export const useGetDetailReportConfig = (id?: ReportConfigData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: reportConfigQueryKeys.detail(id ?? ''),
        queryFn: () => reportConfigApis.getDetail(id!),
        enabled: !!id,
    });

    return {
        reportConfigData: data?.data?.data,
        ...res,
    };
};
