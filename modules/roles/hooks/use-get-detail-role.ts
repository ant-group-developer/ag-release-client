import { useQuery } from '@tanstack/react-query';
import { rolesApis } from '../apis';
import { rolesQueryKeys } from '../constants/query-keys';
import { RolesData } from '../types';

export const useGetDetailRole = (id: RolesData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: rolesQueryKeys.detail(id),
        queryFn: () => rolesApis.getDetail(id),
    });

    const defaultData: RolesData = {
        creatorId: '',
        modifierId: '',
        name: '',
        color: '',
        id: '',
        createdAt: '',
        updatedAt: null,
        note: '',
        code: '',
        rolePermissions: [],
        isActive: false,
    };

    return {
        roleData: data?.data?.data ?? defaultData,
        ...res,
    };
};
