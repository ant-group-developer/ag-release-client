import { useQuery } from '@tanstack/react-query';
import { dspReportApi } from '../apis';
import { dspReportQueryKeys } from '../constants/query-keys';

export const useGetFtpReportFileDiscoveryRuns = (enabled: boolean = true) => {
    const { data, isLoading, ...res } = useQuery({
        queryKey: dspReportQueryKeys.ftpReportFileDiscoveryRuns(),
        queryFn: () => dspReportApi.getFtpReportFileDiscoveryRuns(),
        enabled,
    });

    const discoveryRuns = data?.data?.data ?? [];

    return {
        discoveryRuns,
        isLoading,
        ...res,
    };
};
