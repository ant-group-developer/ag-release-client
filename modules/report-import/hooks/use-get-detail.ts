import { useQuery } from '@tanstack/react-query';
import { reportConfigApis, ftpExcludePatternApis } from '../apis';
import { reportConfigQueryKeys, ftpExcludePatternQueryKeys } from '../constants/query-keys';
import { ReportConfigData, FtpExcludePatternData } from '../types';

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

export const useGetDetailFtpExcludePattern = (id?: FtpExcludePatternData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: ftpExcludePatternQueryKeys.detail(id ?? ''),
        queryFn: () => ftpExcludePatternApis.getDetail(id!),
        enabled: !!id,
    });

    return {
        ftpExcludePatternData: data?.data?.data,
        ...res,
    };
};
