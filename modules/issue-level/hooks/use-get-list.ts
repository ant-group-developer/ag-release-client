import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { issueLevelApis } from '../apis';
import { issueLevelQueryKeys } from '../constants/query-keys';
import { IssueLevelData, IssueLevelDataFilter } from '../types';

export const useGetListIssueLevel = (params: IssueLevelDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: issueLevelQueryKeys.list(params),
        queryFn: () => issueLevelApis.getList(params),
        placeholderData: (prev) => prev,
    });

    const issueLevelData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<IssueLevelData>['data']);

    return {
        issueLevelData,
        ...res,
    };
};
