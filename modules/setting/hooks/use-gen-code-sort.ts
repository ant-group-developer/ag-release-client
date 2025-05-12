import { showNotification } from '@/helpers/messages-helper';
import { useMutation } from '@tanstack/react-query';
import { settingApi } from '../apis';

export const useCodeSort = () => {
    const onSuccess = () => {
        showNotification('success', 'Gen code successfully');
    };

    const onError = () => {
        showNotification('error', 'Gen code failed');
    };

    const mutation = useMutation({
        mutationFn: () => settingApi.genColumnCodeSort(),
        onSuccess,
        onError,
    });

    const genCodeSort = () => {
        return mutation.mutate();
    };

    return { genCodeSort, ...mutation };
};
