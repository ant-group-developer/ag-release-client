import { useQuery } from '@tanstack/react-query';
import { releaseVideoApi } from '../apis';
import { releaseVideoQueryKeys } from '../constants/query-keys';
import { ReleaseVideoData } from '../types';

export const useGetDetailReleaseVideo = (id?: ReleaseVideoData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: releaseVideoQueryKeys.detail(id || ''),
        queryFn: () => releaseVideoApi.getDetail(id || ''),
        enabled: !!id,
    });

    const releaseVideoDetail = data?.data?.data;

    return {
        releaseVideoDetail,
        ...res,
    };
};
