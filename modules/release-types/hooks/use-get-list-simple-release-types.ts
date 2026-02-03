import { useQuery } from '@tanstack/react-query';
import { releaseTypesApi } from '../apis';
import { releaseTypesQueryKeys } from '../constants/query-keys';

export const useGetListSimpleReleaseTypes = (options?: {
    enabled: boolean;
}) => {
    const { data, ...res } = useQuery({
        queryKey: releaseTypesQueryKeys.listsSimple(),
        queryFn: () => releaseTypesApi.getListSimple(),
        placeholderData: (prev) => prev,
        enabled: options?.enabled ?? true,
    });

    const releaseTypesData = data?.data?.data ?? [];

    return {
        releaseTypesData,
        ...res,
    };
};
