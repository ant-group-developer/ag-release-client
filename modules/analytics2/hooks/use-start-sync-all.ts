import { useMutation } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { SyncAllRequest } from '../types';

export const useStartSyncAll = () => {
    return useMutation({
        mutationFn: (params: SyncAllRequest) =>
            analytics2Apis.startSyncAll(params),
    });
};
