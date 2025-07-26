import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { useQuery } from '@tanstack/react-query';
import { genresApi } from '../apis';
import { genreQueryKeys } from '../constants/query-keys';
import { GenresDataFilter } from '../types';

export const useGetListGenres = (params: GenresDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: [...genreQueryKeys.getList, params],
        queryFn: () => genresApi.getList(params),
    });

    const genresData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    const lastUpdatedAt = formattedDate(
        res.dataUpdatedAt,
        DATE_FORMAT.HOUR_MINUTE_SECOND
    );

    return {
        genresData,
        lastUpdatedAt,
        ...res,
    };
};
