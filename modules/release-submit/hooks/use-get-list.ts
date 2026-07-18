import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { releaseSubmitApis } from '../apis';
import { releaseSubmitQueryKeys } from '../constants/query-keys';
import {
    ReleaseSubmitFilter,
    ReleaseSubmitPaginationResponse,
} from '../types';

export const useGetListReleaseSubmits = (params: ReleaseSubmitFilter) => {
    const { data, ...rest } = useQuery({
        queryKey: releaseSubmitQueryKeys.getLists(params),
        queryFn: () => releaseSubmitApis.getList(params),
        placeholderData: (prevData) => prevData,
    });

    const releaseSubmitsData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as ReleaseSubmitPaginationResponse['data']);

    return { releaseSubmitsData, ...rest };
};
