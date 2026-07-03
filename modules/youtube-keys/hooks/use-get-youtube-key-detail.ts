import { useQuery } from '@tanstack/react-query';
import { youtubeKeysApi } from '../apis';
import { youtubeKeysQueryKeys } from '../constants/query-keys';
import { YoutubeKeyData } from '../types';

export const useGetYoutubeKeyDetail = (id?: string | number) => {
    const { data, ...res } = useQuery({
        queryKey: youtubeKeysQueryKeys.detail(id!),
        queryFn: () => youtubeKeysApi.getDetail(id!),
        enabled: !!id,
        refetchOnWindowFocus: false,
    });

    const youtubeKeyDetail: YoutubeKeyData | undefined = data?.data?.data;

    return {
        youtubeKeyDetail,
        ...res,
    };
};
