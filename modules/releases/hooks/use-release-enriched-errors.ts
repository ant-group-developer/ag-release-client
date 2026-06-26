import { useQuery } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { ReleasesData } from '../types';

interface UseReleaseEnrichedErrorsParams {
    id: ReleasesData['id'];
    isFixed?: boolean;
}

export const useReleaseEnrichedErrors = ({
    id,
    isFixed,
}: UseReleaseEnrichedErrorsParams) => {
    const { data, ...res } = useQuery({
        queryKey: releasesQueryKeys.enrichedError(id, isFixed),
        queryFn: () => releasesApi.getEnrichedErrors(id, isFixed),
        placeholderData: (prev) => prev,
        enabled: !!id,
    });

    return {
        releaseEnrichedErrorsData: data?.data?.data ?? [],
        ...res,
    };
};
