import { useApiNotify } from '@/hooks/use-api-notify';
import { DetailResponse, UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { ReleasesData } from '../types';
import { UpdateReleaseDraftPayload } from '../types/payload';

export const useUpdateReleaseDraft = () => {
    // const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onMutate = async (
        variables: UpdateVariables<string, UpdateReleaseDraftPayload>
    ) => {
        const { id, payload } = variables;
        // Cancel query đang pending của detail
        await queryClient.cancelQueries({
            queryKey: releasesQueryKeys.detail(id),
        });

        // Snapshot giá trị cũ để rollback nếu lỗi
        const previousDetail = queryClient.getQueryData(
            releasesQueryKeys.detail(id)
        );

        // Optimistically update detail
        queryClient.setQueryData(releasesQueryKeys.detail(id), (old: any) => {
            if (!old) return old;
            return {
                ...old,
                data: {
                    ...old.data,
                    data: {
                        ...old.data?.data,
                        ...payload,
                    },
                },
            };
        });

        // Return context với snapshot để rollback
        return { previousDetail };
    };

    const onSuccess = (
        data: AxiosResponse<DetailResponse<ReleasesData>>,
        {
            onSuccess,
            id,
        }: UpdateVariables<ReleasesData['id'], UpdateReleaseDraftPayload>
    ) => {
        // Set data chính xác từ API response vào detail cache
        queryClient.setQueryData(releasesQueryKeys.detail(id), data);

        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.lists(),
        });
        // queryClient.invalidateQueries({
        //     queryKey: releasesQueryKeys.detail(data?.data?.data?.id),
        // });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.validations(),
        });

        // const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.(data?.data?.data);
        // showNotification('success', responseMessages);
    };

    const onError = (
        data: AxiosResponse<DetailResponse<ReleasesData>>,
        {
            onError,
            id,
        }: UpdateVariables<ReleasesData['id'], UpdateReleaseDraftPayload>,
        context: any
    ) => {
        // Rollback detail về state trước đó nếu có lỗi
        if (context?.previousDetail) {
            queryClient.setQueryData(
                releasesQueryKeys.detail(id),
                context.previousDetail
            );
        }

        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<ReleasesData['id'], UpdateReleaseDraftPayload>) =>
            releasesApi.updateReleaseDraft(id, payload),
        onMutate,
        onSuccess,
        onError,
    });
    const updateReleaseDraft = (
        variables: UpdateVariables<
            ReleasesData['id'],
            UpdateReleaseDraftPayload
        >
    ) => {
        return mutation.mutate(variables);
    };

    return {
        updateReleaseDraft,
        ...mutation,
    };
};
