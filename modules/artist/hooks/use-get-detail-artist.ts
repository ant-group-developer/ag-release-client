import { useQuery } from '@tanstack/react-query';
import { artistApi } from '../apis';
import { artistQueryKeys } from '../constants/query-keys';
import { ArtistData } from '../types';

export const useGetDetailArtist = (id: ArtistData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: artistQueryKeys.detail(id),
        queryFn: () => artistApi.getDetail(id),
        enabled: !!id,
    });

    const defaultData: ArtistData = {
        name: '',
        biography: '',
        creatorId: '',
        id: '',
        createdAt: '',
        updatedAt: null,
        releaseCount: 0,
        trackCount: 0,
        code: '',
    };

    return {
        artistData: data?.data?.data ?? defaultData,
        ...res,
    };
};
