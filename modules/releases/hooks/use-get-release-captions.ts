import { useQuery } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';

export const useGetReleaseCaptions = (
    releaseId: string,
    type?: string,
    options?: {
        enabled?: boolean;
    }
) => {
    const { data, ...res } = useQuery({
        queryKey: releasesQueryKeys.captionList(releaseId, type),
        queryFn: () => {
            return releasesApi.getReleaseCaptions(releaseId, type);
        },
        placeholderData: (previousData) => previousData,
        enabled: !!releaseId && (options?.enabled ?? true),
    });

    const releaseCaptionsData = data?.data?.data ?? [];

    return {
        releaseCaptionsData,
        ...res,
    };
};
