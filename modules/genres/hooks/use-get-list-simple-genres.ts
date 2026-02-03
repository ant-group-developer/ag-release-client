import { useQuery } from '@tanstack/react-query';
import { genresApi } from '../apis';
import { genreQueryKeys } from '../constants/query-keys';

export const useGetListSimpleGenres = () => {
    const { data, ...res } = useQuery({
        queryKey: genreQueryKeys.listsSimple(),
        queryFn: () => genresApi.getListSimple(),
        placeholderData: (prev) => prev,
    });

    const genresData = data?.data?.data ?? [];

    return {
        genresData,
        ...res,
    };
};
