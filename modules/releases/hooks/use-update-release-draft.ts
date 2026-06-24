import { useApiNotify } from '@/hooks/use-api-notify';
import { DetailResponse, UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useCallback, useRef } from 'react';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { ReleasesData } from '../types';
import { UpdateReleaseDraftPayload } from '../types/payload';

export const useUpdateReleaseDraft = () => {
    // const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const latestMutationRef = useRef(0);

    const latestResponseRef = useRef<AxiosResponse<
        DetailResponse<ReleasesData>
    > | null>(null);

    const setCacheTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scheduleSetDetailCache = useCallback(
        (
            id: ReleasesData['id'],
            data: AxiosResponse<DetailResponse<ReleasesData>>
        ) => {
            latestResponseRef.current = data;

            if (setCacheTimerRef.current) {
                clearTimeout(setCacheTimerRef.current);
            }

            setCacheTimerRef.current = setTimeout(() => {
                if (!latestResponseRef.current) return;

                queryClient.setQueryData(
                    releasesQueryKeys.detail(id),
                    latestResponseRef.current
                );

                latestResponseRef.current = null;
                setCacheTimerRef.current = null;
            }, 15000);
        },
        [queryClient]
    );

    const onMutate = async (
        variables: UpdateVariables<string, UpdateReleaseDraftPayload>
    ) => {
        const { id, payload } = variables;

        const mutationId = latestMutationRef.current + 1;
        latestMutationRef.current = mutationId;

        if (setCacheTimerRef.current) {
            clearTimeout(setCacheTimerRef.current);
            setCacheTimerRef.current = null;
        }

        latestResponseRef.current = null;

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
            const previousRelease = old.data?.data;

            return {
                ...old,
                data: {
                    ...old.data,
                    data: {
                        ...previousRelease,
                        ...payload,
                        ...(payload.video && {
                            video: {
                                ...previousRelease?.video,
                                ...payload.video,
                            },
                        }),
                        ...(payload.releaseLanguage && {
                            releaseLanguage: {
                                ...previousRelease?.releaseLanguage,
                                ...payload.releaseLanguage,
                            },
                        }),
                    },
                },
            };
        });

        // Return context với snapshot để rollback
        return { previousDetail, mutationId };
    };

    const onSuccess = (
        data: AxiosResponse<DetailResponse<ReleasesData>>,
        {
            onSuccess,
            id,
        }: UpdateVariables<ReleasesData['id'], UpdateReleaseDraftPayload>,
        context: any
    ) => {
        // Set data chính xác từ API response vào detail cache
        // queryClient.setQueryData(releasesQueryKeys.detail(id), data);

        const isLatestMutation =
            context?.mutationId === latestMutationRef.current;

        if (isLatestMutation) {
            scheduleSetDetailCache(id, data);
        }

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
        error: any,
        {
            onError,
            id,
        }: UpdateVariables<ReleasesData['id'], UpdateReleaseDraftPayload>,
        context: any
    ) => {
        const isLatestMutation =
            context?.mutationId === latestMutationRef.current;

        // Rollback detail về state trước đó nếu có lỗi
        if (isLatestMutation && context?.previousDetail) {
            queryClient.setQueryData(
                releasesQueryKeys.detail(id),
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
        }: UpdateVariables<ReleasesData['id'], UpdateReleaseDraftPayload>) =>
            releasesApi.updateReleaseDraft(id, payload),
        onMutate,
        onSuccess,
        onError,
    });
    const updateReleaseDraft = useCallback(
        (
            variables: UpdateVariables<
                ReleasesData['id'],
                UpdateReleaseDraftPayload
            >
        ) => mutation.mutate(variables),
        [mutation.mutate]
    );

    return {
        updateReleaseDraft,
        ...mutation,
    };
};
