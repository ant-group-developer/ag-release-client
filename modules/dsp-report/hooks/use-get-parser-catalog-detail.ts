import { useQuery } from '@tanstack/react-query';
import { dspReportApi } from '../apis';
import { dspReportQueryKeys } from '../constants/query-keys';

export const useGetParserCatalogDetail = (
    parserCode: string,
    enabled: boolean = true
) => {
    const { data, isLoading, ...res } = useQuery({
        queryKey: dspReportQueryKeys.parserCatalogDetail(parserCode),
        queryFn: () => dspReportApi.getParserCatalogDetail(parserCode),
        enabled: !!parserCode && enabled,
    });

    const parserDetail = data?.data?.data;

    return {
        parserDetail,
        isLoading,
        ...res,
    };
};
