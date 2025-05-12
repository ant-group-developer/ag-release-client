import { productApi } from '@/modules/product/apis';
import { productQueryKeys } from '@/modules/product/constants';
import { CommonDataSidebar } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export const useGetApprovalUserList = ({ enable }: { enable: boolean }) => {
    const { data, ...res } = useQuery({
        queryKey: [...productQueryKeys.getApprovalUserList],
        queryFn: () => productApi.getApprovalUserList(),
        enabled: enable,
    });

    const defaultData: CommonDataSidebar[] = [];
    const approvalUserList = data?.data?.data ?? defaultData;

    return {
        approvalUserList,
        ...res,
    };
};
