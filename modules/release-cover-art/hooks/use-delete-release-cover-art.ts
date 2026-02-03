import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releaseCoverArtApi } from '../apis';

export const useDeleteReleaseCoverArt = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (data: any, { onSuccess }: DeleteVariables<string>) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.details(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (data: any, { onError }: DeleteVariables<string>) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<string>) =>
            releaseCoverArtApi.deleteReleaseCoverArt(id),
        onSuccess,
        onError,
    });

    const deleteReleaseCoverArt = (variables: DeleteVariables<string>) => {
        return mutation.mutate(variables);
    };

    return { deleteReleaseCoverArt, mutation };
};
