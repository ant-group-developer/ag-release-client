import { useQuery } from '@tanstack/react-query';
import { sourceTypeConfigApis } from '../apis';
import { sourceTypeConfigQueryKeys } from '../constants/query-keys';
import { SourceTypeConfigData } from '../types';

export const useGetSourceTypeConfigs = () => {
    const { data, ...res } = useQuery({
        queryKey: sourceTypeConfigQueryKeys.lists(),
        queryFn: () => sourceTypeConfigApis.getList(),
    });

    const responseData = data?.data;
    const sourceTypeConfigsData: SourceTypeConfigData[] = Array.isArray(
        (responseData as any)?.data
    )
        ? (responseData as any).data
        : Array.isArray(responseData)
          ? (responseData as any)
          : [];

    return {
        sourceTypeConfigsData,
        ...res,
    };
};
