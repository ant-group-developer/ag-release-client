import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { releaseExecutionApis } from '../apis';
import { releaseExecutionQueryKeys } from '../constants/query-keys';
import {
    ReleaseExecutionData,
    ReleaseExecutionFilter,
    ReleaseExecutionPaginationResponse,
} from '../types';

export const useGetListReleaseExecutions = (
    params: ReleaseExecutionFilter
) => {
    const { data, ...rest } = useQuery({
        queryKey: releaseExecutionQueryKeys.getLists(params),
        queryFn: () => releaseExecutionApis.getList(params),
        placeholderData: (prevData) => prevData,
    });

    const releaseExecutionsData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as ReleaseExecutionPaginationResponse['data']);

    return { releaseExecutionsData, ...rest };
};
