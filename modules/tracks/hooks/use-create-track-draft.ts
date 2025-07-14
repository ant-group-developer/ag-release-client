import { showNotification } from '@/helpers/messages-helper';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackApi } from '../apis';
import { trackQueryKeys } from '../constants/query-keys';
import { trackPayload } from '../types/payload';

export const useCreateTrackDraft = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<trackPayload[]>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...trackQueryKeys.getList],
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<trackPayload[]>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
    };
    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<trackPayload[]>) =>
            trackApi.createTrackDraft({ trackDrafts: payload }),
        onSuccess,
        onError,
    });

    const createTrackDraft = (variables: CreateVariables<trackPayload[]>) => {
        return mutation.mutate(variables);
    };

    return {
        createTrackDraft,
        ...mutation,
    };
};
