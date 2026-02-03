import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { issuesApis } from '../apis';
import { issuesQueryKeys } from '../constants/query-keys';
import { IssueData, IssueDataFilter } from '../types';

export const useGetListIssue = (params: IssueDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: issuesQueryKeys.list(params),
        queryFn: () => issuesApis.getList(params),
        placeholderData: (prev) => prev,
    });

    const issueData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<IssueData>['data']);

    return {
        issueData,
        ...res,
    };
};
