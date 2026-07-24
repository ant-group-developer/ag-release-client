import { useQuery } from '@tanstack/react-query';
import { dspReportApi } from '../apis';
import { dspReportQueryKeys } from '../constants/query-keys';

export const useGetFtpParserConfigDetail = (id: string, category: string) => {
    const { data, ...res } = useQuery({
        queryKey: [...dspReportQueryKeys.ftpParserConfigs(id), category] as const,
        queryFn: () => dspReportApi.getFtpParserConfigDetail(id, category),
        enabled: !!id && !!category,
    });

    const ftpParserConfigDetail = data?.data?.data;

    return {
        ftpParserConfigDetail,
        ...res,
    };
};
