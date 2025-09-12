import { useQuery } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';

export const useDownloadReleaseAssets = (releaseId: string) => {
    const { data, ...res } = useQuery({
        queryKey: [...releasesQueryKeys.downloadAssets(), releaseId],
        queryFn: () => releasesApi.downloadAssets(releaseId),
    });

    return {
        data,
        ...res,
    };
};
