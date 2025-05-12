import { orderQueryKeys } from '@/modules/order/constants';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../apis';
import { UploadProductHistoryPayload } from '../types';

export const useGetUploadHistory = (
    params: UploadProductHistoryPayload,
    enabled: boolean
) => {
    const { data, ...res } = useQuery({
        queryKey: [...orderQueryKeys.getList, params],
        queryFn: () => productApi.getUploadHistory(params),
        enabled,
    });

    const uploadHistoryData = data?.data?.data ?? [];
    return {
        uploadHistoryData,
        ...res,
    };
};
