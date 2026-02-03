import { useQuery } from '@tanstack/react-query';
import { permissionApis } from '../apis';
import { permissionQueryKeys } from '../constants/query-keys';
import { PermissionData } from '../types';

export const useGetDetailPermission = (id: PermissionData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: permissionQueryKeys.detail(id),
        queryFn: () => permissionApis.getDetail(id),
    });

    const defaultData: PermissionData = {
        creatorId: '',
        modifierId: '',
        name: '',
        code: '',
        id: '',
        createdAt: '',
        updatedAt: null,
        note: '',
        isActive: true,
    };

    return {
        permissionData: data?.data?.data ?? defaultData,
        ...res,
    };
};
