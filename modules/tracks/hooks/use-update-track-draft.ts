import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { DetailResponse, UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { trackApi } from '../apis';
import { trackQueryKeys } from '../constants/query-keys';
import { TrackData } from '../types';
import { UpdateTrackPayload } from '../types/payload';

export const useUpdateTrackDraft = () => {
    // const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onMutate = async (
        variables: UpdateVariables<string, UpdateTrackPayload>
    ) => {
        const { id, payload } = variables;

        // Cancel query đang pending của detail
        await queryClient.cancelQueries({
            queryKey: trackQueryKeys.detail(id),
        });

        // Snapshot giá trị cũ để rollback nếu lỗi
        const previousDetail = queryClient.getQueryData(
            trackQueryKeys.detail(id)
        );

        // Optimistically update detail
        queryClient.setQueryData(trackQueryKeys.detail(id), (old: any) => {
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
        data: AxiosResponse<DetailResponse<TrackData>>,
        { onSuccess, id }: UpdateVariables<TrackData['id'], UpdateTrackPayload>
    ) => {
        // Set data chính xác từ API response vào detail cache
        queryClient.setQueryData(trackQueryKeys.detail(id), data);

        // Invalidate related queries
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.list(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.validations(),
        });

        onSuccess?.(data?.data?.data);
    };

    const onError = (
        error: any,
        { onError, id }: UpdateVariables<TrackData['id'], UpdateTrackPayload>,
        context: any
    ) => {
        if (context?.previousDetail) {
            queryClient.setQueryData(
                trackQueryKeys.detail(id),
                context.previousDetail
            );
        }

        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<TrackData['id'], UpdateTrackPayload>) =>
            trackApi.updateTrackDraft(id, payload),
        onSuccess,
        onError,
        onMutate,
    });

    const updateTrackDraft = (
        variables: UpdateVariables<TrackData['id'], UpdateTrackPayload>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        updateTrackDraft,
        ...mutation,
    };
};
