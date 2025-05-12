import { userApi } from '@/modules/user/api';
import { CommonDataSidebar } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { orderQueryKeys } from '../constants';

export const useGetCreatorUserList = ({ enable }: { enable: boolean }) => {
    const { data, ...res } = useQuery({
        queryKey: [...orderQueryKeys.getCreatorUserList],
        queryFn: () => userApi.getCreatorUserList(),
        enabled: enable,
    });

    const defaultData: CommonDataSidebar[] = [];
    const creatorUserList = data?.data?.data ?? defaultData;

    return {
        creatorUserList,
        ...res,
    };
};
