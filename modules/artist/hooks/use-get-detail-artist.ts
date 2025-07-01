import { useQuery } from '@tanstack/react-query';
import { artistApi } from '../apis';
import { artistQueryKeys } from '../constants/query-keys';
import { ArtistData } from '../types';

export const useGetDetailArtist = (id: ArtistData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: [...artistQueryKeys.getDetail, id],
        queryFn: () => artistApi.getDetail(id),
    });

    const defaultData: ArtistData = {
        name: '',
        biography: '',
        creatorId: '',
        id: '',
        createdAt: '',
        updatedAt: null,
    };

    return {
        artistData: data?.data?.data ?? defaultData,
        ...res,
    };
};
