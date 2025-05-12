import { productApi } from '@/modules/product/apis';
import { productQueryKeys } from '@/modules/product/constants';
import { CommonDataSidebar } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export const useGetAssigneeUserList = ({ enable }: { enable: boolean }) => {
    const { data, ...res } = useQuery({
        queryKey: [...productQueryKeys.getAssigneeUserList],
        queryFn: () => productApi.getAssigneeUserList(),
        enabled: enable,
    });

    const defaultData: CommonDataSidebar[] = [];
    const assigneeUserList = data?.data?.data ?? defaultData;

    return {
        assigneeUserList,
        ...res,
    };
};
