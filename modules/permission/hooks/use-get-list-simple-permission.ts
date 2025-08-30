import { useQuery } from '@tanstack/react-query';
import { permissionApis } from '../apis';
import { permissionQueryKeys } from '../constants/query-keys';

export const useGetListSimplePermission = () => {
    const { data, ...res } = useQuery({
        queryKey: permissionQueryKeys.listsSimple(),
        queryFn: () => permissionApis.getListSimple(),
        placeholderData: (prev) => prev,
    });

    const permissionData = data?.data?.data ?? [];

    return {
        permissionData,
        ...res,
    };
};
