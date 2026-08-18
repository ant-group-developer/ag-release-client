import { useQuery } from '@tanstack/react-query';
import { genresApi } from '../apis';
import { genreQueryKeys } from '../constants/query-keys';
import { GENRE_SCOPE } from '../enums';
import { GenresData } from '../types';

export const useGetDetailGenre = (id: GenresData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: genreQueryKeys.detail(id),
        queryFn: () => genresApi.getDetail(id),
    });

    const defaultData: GenresData = {
        name: '',
        picture: '',
        description: '',
        id: '',
        createdAt: '',
        updatedAt: null,
        code: '',
        scope: GENRE_SCOPE.AUDIO,
    };

    return {
        genreData: data?.data?.data ?? defaultData,
        ...res,
    };
};
