import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { ArtistDataFilter } from '@/modules/artist/types';
import { useQuery } from '@tanstack/react-query';
import { artistRoleApi } from '../apis';
import { artistRoleQueryKeys } from '../constants/query-keys';

export const useGetListArtistRole = (params: ArtistDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: [...artistRoleQueryKeys.getList, params],
        queryFn: () => artistRoleApi.getList(params),
    });

    const artistsRolesData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    const lastUpdatedAt = formattedDate(
        res.dataUpdatedAt,
        DATE_FORMAT.HOUR_MINUTE_SECOND
    );

    return {
        artistsRolesData,
        lastUpdatedAt,
        ...res,
    };
};
