import { useQuery } from '@tanstack/react-query';
import { genresApi } from '../apis';
import { genreQueryKeys } from '../constants/query-keys';
import { GENRE_SCOPE } from '../enums';

export const useGetListSimpleGenres = (params?: { scope?: GENRE_SCOPE }) => {
    const { data, ...res } = useQuery({
        queryKey: genreQueryKeys.listsSimple(params?.scope),
        queryFn: () => genresApi.getListSimple(params),
        placeholderData: (prev) => prev,
    });

    const genresData = data?.data?.data ?? [];

    return {
        genresData,
        ...res,
    };
};
