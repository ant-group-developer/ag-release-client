import { useQuery } from '@tanstack/react-query';
import { artistRoleApi } from '../apis';
import { artistRoleQueryKeys } from '../constants/query-keys';

export const useGetListSimpleArtistRole = () => {
    const { data, ...res } = useQuery({
        queryKey: artistRoleQueryKeys.listSimple(),
        queryFn: () => artistRoleApi.getListSimple(),
        placeholderData: (prev) => prev,
    });

    const artistsRolesData = data?.data?.data ?? [];

    return {
        artistsRolesData,
        ...res,
    };
};
