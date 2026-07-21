import { useQuery } from '@tanstack/react-query';
import { dspReportApi } from '../apis';
import { dspReportQueryKeys } from '../constants/query-keys';

export const useGetFtpParserConfigs = (id: string) => {
    const { data, ...res } = useQuery({
        queryKey: dspReportQueryKeys.ftpParserConfigs(id),
        queryFn: () => dspReportApi.getFtpParserConfigs(id),
        enabled: !!id,
    });

    const ftpParserConfigs = data?.data?.data ?? [];

    return {
        ftpParserConfigs,
        ...res,
    };
};
