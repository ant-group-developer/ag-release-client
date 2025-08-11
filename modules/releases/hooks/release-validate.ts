import { useQuery } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { ReleasesData } from '../types';

export const useReleaseValidate = (id: ReleasesData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: releasesQueryKeys.validate(id),
        queryFn: () => releasesApi.validate(id),
    });

    return {
        releaseValidateData: data?.data?.data ?? [],
        ...res,
    };
};
