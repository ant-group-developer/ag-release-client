import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { ArtistDataFilter } from '@/modules/artist/types';
import { useQuery } from '@tanstack/react-query';
import { artistRoleApi } from '../apis';
import { artistRoleQueryKeys } from '../constants/query-keys';

export const useGetListArtistRole = (params: ArtistDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: artistRoleQueryKeys.lists(params),
        queryFn: () => artistRoleApi.getList(params),
    });

    const artistsRolesData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        artistsRolesData,

        ...res,
    };
};
