import { useQuery } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { ReleaseEnrichedError, ReleaseEnrichedErrorFilter } from '../types';

type UseReleaseEnrichedErrorsParams = Omit<
    ReleaseEnrichedErrorFilter,
    'releaseId'
> & {
    id: ReleaseEnrichedErrorFilter['releaseId'];
};

export const useReleaseEnrichedErrors = (
    params: UseReleaseEnrichedErrorsParams
) => {
    const { id, ...filters } = params;
    const apiParams: ReleaseEnrichedErrorFilter = {
        releaseId: id,
        ...filters,
    };

    const { data, ...res } = useQuery({
        queryKey: releasesQueryKeys.enrichedError(apiParams),
        queryFn: () => releasesApi.getEnrichedErrors(apiParams),
        placeholderData: (prev) => prev,
        enabled: !!id,
    });

    const payload = data?.data?.data;
    const releaseEnrichedErrorsData: ReleaseEnrichedError[] = Array.isArray(
        payload
    )
        ? payload
        : Array.isArray((payload as any)?.items)
          ? (payload as any).items
          : Array.isArray((payload as any)?.data)
            ? (payload as any).data
            : [];

    return {
        releaseEnrichedErrorsData,
        ...res,
    };
};
