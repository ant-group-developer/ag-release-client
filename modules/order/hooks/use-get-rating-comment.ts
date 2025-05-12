import { defaultData } from '@/constants/common';
import { ListResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../apis';
import { commentRatingQueryKeys } from '../constants';
import { CommentRatingData, OrderData } from '../types';

export const useGetRatingComment = (
    orderId: OrderData['id'],
    options?: { enabled?: boolean }
) => {
    const { data, ...res } = useQuery({
        queryKey: [...commentRatingQueryKeys.getDetail, orderId],
        queryFn: () => orderApi.getRatingComment(orderId),
        placeholderData: (previousData) => previousData,
        enabled: options?.enabled,
    });

    const dataCommentRating: ListResponse<CommentRatingData>['data'] =
        data?.data.data ?? defaultData['data'];

    return {
        data: dataCommentRating,
        ...res,
    };
};
