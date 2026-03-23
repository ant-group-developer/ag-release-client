import { useQuery } from '@tanstack/react-query';

import { releaseLogApis } from '../apis';
import { releaseLogQueryKeys } from '../constants/query-keys';
import { ReleaseLogFilter } from '../types';

export const useGetListReleaseLog = (params: ReleaseLogFilter) => {
    const { data, ...rest } = useQuery({
        queryKey: releaseLogQueryKeys.getLists(params),
        queryFn: () => releaseLogApis.getListReleaseLog(params),
        placeholderData: (prevData) => prevData,
    });

    return { releaseLogData: data?.data?.data, ...rest };
};
