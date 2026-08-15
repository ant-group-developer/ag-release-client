import { useQuery } from '@tanstack/react-query';
import { releaseCiStatusSyncApis } from '../apis';
import { releaseCiStatusSyncQueryKeys } from '../constants/query-keys';

export const useGetReleaseCiStatusSyncSchedule = () => {
    const { data, ...res } = useQuery({
        queryKey: releaseCiStatusSyncQueryKeys.schedule(),
        queryFn: () => releaseCiStatusSyncApis.getSchedule(),
    });

    return {
        schedule: data?.data?.data,
        ...res,
    };
};
