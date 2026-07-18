import { useQuery } from '@tanstack/react-query';
import { youtubeKeysApi } from '../apis';
import { youtubeKeysQueryKeys } from '../constants/query-keys';
import { YoutubeKeyData } from '../types';

export const useGetListYoutubeKeys = () => {
    const { data, ...res } = useQuery({
        queryKey: youtubeKeysQueryKeys.lists(),
        queryFn: () => youtubeKeysApi.getList(),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
    });

    const youtubeKeysData: YoutubeKeyData[] = data?.data?.data ?? [];

    return {
        youtubeKeysData,
        ...res,
    };
};
