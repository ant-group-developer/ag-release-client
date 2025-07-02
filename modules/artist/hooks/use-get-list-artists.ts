import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
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

    const lastUpdatedAt = formattedDate(
        res.dataUpdatedAt,
        DATE_FORMAT.HOUR_MINUTE
    );

    return {
        artistsData,
        lastUpdatedAt,
        ...res,
    };
};
