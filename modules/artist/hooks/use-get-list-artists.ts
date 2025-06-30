import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { artistApi } from '../apis';
import { artistQueryKeys } from '../constants/query-keys';
import { ArtistDataFilter } from '../types';

export const useGetListArtist = (params: ArtistDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: [...artistQueryKeys.getList, params],
        queryFn: () => artistApi.getList(params),
    });

    const artistsData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        artistsData,
        ...res,
    };
};
