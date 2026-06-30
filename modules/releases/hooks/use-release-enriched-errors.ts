import { useQuery } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { UseReleaseEnrichedErrorsParams } from '../types';

export const useReleaseEnrichedErrors = (
    params: UseReleaseEnrichedErrorsParams
) => {
    const { data, ...res } = useQuery({
        queryKey: releasesQueryKeys.enrichedError(params),
        queryFn: () => releasesApi.getEnrichedErrors(params),
        placeholderData: (prev) => prev,
        enabled: !!params?.releaseId,
    });

    return {
        releaseEnrichedErrorsData: data?.data?.data?.items ?? [],
        metadata: data?.data?.data?.metadata,
        ...res,
    };
};

