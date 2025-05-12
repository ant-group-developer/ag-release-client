import { showNotification } from '@/helpers/messages-helper';
import { productQueryKeys } from '@/modules/product/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { orderApi } from '../apis';
import { commentRatingQueryKeys, orderQueryKeys } from '../constants';
import { CommentRatingData, CreatePayload } from '../types';

export const useCreateRatingComment = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const onSuccess = (
        data: any,
        { onSuccess }: CreatePayload<CommentRatingData>
    ) => {
        queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });

        queryClient.invalidateQueries({
            queryKey: commentRatingQueryKeys.getDetail,
        });

        showNotification('success', messages(data?.data?.message));
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: CreatePayload<CommentRatingData>
    ) => {
        showNotification('error', messages(data?.response?.data?.message));
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreatePayload<CommentRatingData>) =>
            orderApi.createRatingComment(payload),
        onSuccess,
        onError,
    });

    const createRatingComment = (payload: CreatePayload<CommentRatingData>) => {
        mutation.mutate(payload);
    };

    return {
        createRatingComment,
        ...mutation,
    };
};
