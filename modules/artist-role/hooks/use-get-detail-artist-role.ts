import { useQuery } from '@tanstack/react-query';
import { artistRoleApi } from '../apis';
import { ArtistRoleQueryKeys } from '../constants/query-keys';
import { ArtistRoleData } from '../types';

export const useGetDetailArtistRole = (id: ArtistRoleData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: [...ArtistRoleQueryKeys.getDetail, id],
        queryFn: () => artistRoleApi.getDetail(id),
    });

    const defaultData: ArtistRoleData = {
        name: '',
        creatorId: '',
        modifierId: '',
        id: '',
        createdAt: '',
        updatedAt: null,
    };

    return {
        artistRoleData: data?.data?.data ?? defaultData,
        ...res,
    };
};
