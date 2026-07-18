import { useMutation } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { SyncRequest } from '../types';

export const useStartSync = () => {
    return useMutation({
        mutationFn: (params: SyncRequest) =>
            analytics2Apis.startSync(params),
    });
};
