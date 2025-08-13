import { useQuery } from '@tanstack/react-query';
import { releaseTypesApi } from '../apis';
import { releaseTypesQueryKeys } from '../constants/query-keys';
import { ReleaseTypesData } from '../types';

export const useGetDetailReleaseType = (id: ReleaseTypesData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: releaseTypesQueryKeys.detail(id),
        queryFn: () => releaseTypesApi.getDetail(id),
    });

    const defaultData: ReleaseTypesData = {
        name: '',
        id: '',
        createdAt: '',
        updatedAt: null,
        value: '',
        minTrackCount: 0,
        maxTrackCount: 0,
    };

    return {
        trackTypeData: data?.data?.data ?? defaultData,
        ...res,
    };
};
